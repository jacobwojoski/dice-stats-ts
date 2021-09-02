import * as gulp from "gulp";
import * as fs from "fs-extra";
import * as path from "path";
import archiver from "archiver";
import stringify from "json-stringify-pretty-compact";

const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');
const buffer = require('vinyl-buffer');
const source = require('vinyl-source-stream');

import {
    createLiteral,
    factory,
    isExportDeclaration,
    isImportDeclaration,
    isStringLiteral,
    LiteralExpression,
    Node,
    TransformationContext,
    Transformer as TSTransformer,
    TransformerFactory,
    visitEachChild,
    visitNode,
} from "typescript";
import Vinyl from "vinyl";
import {Readable} from "stream";
import less from "gulp-less";

import Logger from "./Source/Utils/Logger";
import {ModuleData} from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/packages.mjs";
import browserify from "browserify";

const ts = require("gulp-typescript");
const git = require("gulp-git");

const argv = require("yargs").argv;

function getConfig() {
    const configPath = path.resolve(process.cwd(), "foundryconfig.json");
    let config;

    if (fs.existsSync(configPath)) {
        config = fs.readJSONSync(configPath);
        return config;
    } else {
        return;
    }
}

interface Manifest {
    root: string;
    file: ModuleData;
    name: string;
}

const getManifest = (): Manifest | null => {
    const json: Manifest = {
        root: "",
        // @ts-ignore
        file: {},
        name: ""
    };

    if (fs.existsSync("src")) {
        json.root = "src";
    } else {
        json.root = "dist";
    }

    const modulePath = path.join(json.root, "module.json");
    const systemPath = path.join(json.root, "system.json");

    if (fs.existsSync(modulePath)) {
        json.file = fs.readJSONSync(modulePath);
        json.name = "module.json";
    } else if (fs.existsSync(systemPath)) {
        json.file = fs.readJSONSync(systemPath);
        json.name = "system.json";
    } else {
        return null;
    }

    // If we can pull our version from our package - saves us having to maintain the number in different places
    if (process.env.npm_package_version)
        json.file!.version = process.env.npm_package_version;

    return json;
}

const createTransformer = (): TransformerFactory<any> => {
    /**
     * @param {typescript.Node} node
     */
    const shouldMutateModuleSpecifier = (node: Node): boolean => {
        if (!isImportDeclaration(node) && !isExportDeclaration(node))
            return false;
        if (node.moduleSpecifier === undefined)
            return false;
        if (!isStringLiteral(node.moduleSpecifier))
            return false;
        if (!node.moduleSpecifier.text.startsWith("./") && !node.moduleSpecifier.text.startsWith("../"))
            return false;

        return path.extname(node.moduleSpecifier.text) === "";
    }

    return (context: TransformationContext): TSTransformer<any> => {
        return (node: Node) => {
            function visitor(node: Node): Node {
                if (shouldMutateModuleSpecifier(node)) {
                    if (isImportDeclaration(node)) {
                        const newModuleSpecifier = createLiteral(`${(node.moduleSpecifier as LiteralExpression).text}.js`);
                        return factory.updateImportDeclaration(node, node.decorators, node.modifiers, node.importClause, newModuleSpecifier);
                    } else if (isExportDeclaration(node)) {
                        const newModuleSpecifier = createLiteral(`${(node.moduleSpecifier as LiteralExpression).text}.js`);
                        return factory.updateExportDeclaration(node, node.decorators, node.modifiers, false, node.exportClause, newModuleSpecifier);
                    }
                }
                return visitEachChild(node, visitor, context);
            }

            return visitNode(node, visitor);
        };
    };
}

const tsConfig = ts.createProject("tsconfig.json", {
    getCustomTransformers: (_program: any) => ({
        after: [createTransformer()],
    }),
});

export function string_src(filename: string, contents: string) {
    const src = new Readable({objectMode: true});
    src._read = function () {
        this.push(new Vinyl({
            cwd: "",
            base: "./",
            path: filename,
            contents: Buffer.from(contents),
        }));
        this.push(null);
    };
    return src;
}

export const json_src = (filename: string, contents: any) => string_src(filename, JSON.stringify(contents));

/********************/
/*		BUILD		*/
/********************/

/**
 * Build TypeScript
 */
function buildTS() {
    const debug = process.env.npm_lifecycle_event !== "package";
    let res = tsConfig.src()
        .pipe(sourcemaps.init())
        .pipe(tsConfig());

    return res.js
        .pipe(sourcemaps.write('', { debug: debug, includeContent: true, sourceRoot: './ts/Source' }))
        .pipe(gulp.dest("dist"));
}

const bundleModule = () => {
    const debug = process.env.npm_lifecycle_event !== "package";
    const bsfy = browserify({ debug: debug, entries: "dist/dice-stats.js" });
    return bsfy.bundle()
        .on('error', Logger.Err)
        .pipe(source(path.join("dist", "bundle.js")))
        .pipe(buffer())
        .pipe(uglify())
        .pipe(gulp.dest('./'));
}

/**
 * Build Less
 */
function buildLess() {
    return gulp.src("Source/*.less").pipe(less()).pipe(gulp.dest("dist"));
}

/**
 * Copy static files
 */
async function copyFiles() {
    const statics = ["lang", "fonts", "assets", "templates", "packs", "module.json", "system.json"];
    try {
        for (const file of statics) {
            if (fs.existsSync(path.join("src", file))) {
                await fs.copy(path.join("src", file), path.join("dist", file));
            }
        }
        return Promise.resolve();
    } catch (err) {
        await Promise.reject(err);
    }
}

const cleanDist = async () => {
    Logger.Log("Cleaning dist file clutter");

    const files: string[] = [];
    const getFiles = async (dir: string) => {
        Logger.Log("Searching " + Logger.Highlight(dir));
        const arr = await fs.promises.readdir(dir);
        for(const entry of arr)
        {
            const fullPath = path.join(dir, entry);
            const stat = await fs.promises.stat(fullPath);
            if (stat.isDirectory())
                await getFiles(fullPath);
            else
                files.push(fullPath);
        }
    }

    await getFiles(path.resolve("./dist"));
    for(const file of files) {
        if (file.endsWith("bundle.js") || file.endsWith(".css") || file.endsWith("module.json"))
            continue;

        Logger.Warn("Cleaning " + path.relative(process.cwd(), file));
        await fs.promises.unlink(file);
    }
}

/**
 * Watch for changes for each build step
 */
function buildWatch() {
    gulp.watch("Source/**/*.ts", { ignoreInitial: false }, buildTS);
    gulp.watch("Source/**/*.less", { ignoreInitial: false }, buildLess);
    gulp.watch(["Source/fonts", "Source/lang", "Source/templates", "Source/*.json"], { ignoreInitial: false }, copyFiles);
}

/********************/
/*		CLEAN		*/
/********************/

/**
 * Remove built files from `dist` folder
 * while ignoring source files
 */
async function clean() {
    const name = path.basename(path.resolve("."));
    const files = [];

    // If the project uses TypeScript
    if (fs.existsSync(path.join("src", `${name}.ts`))) {
        files.push(
            "lang",
            "templates",
            "assets",
            "module",
            `${name}.js`,
            "module.json",
            "system.json",
            "template.json"
        );
    }

    // If the project uses Less or SASS
    if (fs.existsSync(path.join("src", `${name}.less`)) || fs.existsSync(path.join("src", `${name}.scss`))) {
        files.push("fonts", `${name}.css`);
    }

    Logger.Warn("Files to clean:");
    Logger.Ok("   " + Logger.Highlight(files.join("\n    ")));

    // Attempt to remove the files
    try {
        for (const filePath of files) {
            await fs.remove(path.join("dist", filePath));
        }
        return Promise.resolve();
    } catch (err) {
        await Promise.reject(err);
    }
}

/********************/
/*		LINK		*/
/********************/

/**
 * Link build to User Data folder
 */
async function linkUserData() {
    const name = path.basename(path.resolve("."));
    const config = fs.readJSONSync("foundryconfig.json");

    let destDir;
    try {
        if (
            fs.existsSync(path.resolve(".", "dist", "module.json")) ||
            fs.existsSync(path.resolve(".", "src", "module.json"))
        ) {
            destDir = "modules";
        } else if (
            fs.existsSync(path.resolve(".", "dist", "system.json")) ||
            fs.existsSync(path.resolve(".", "src", "system.json"))
        ) {
            destDir = "systems";
        } else {
            throw Error(`Could not find ${Logger.Highlight("module.json")} or ${Logger.Highlight("system.json")}`);
        }

        let linkDir;
        if (config.dataPath) {
            if (!fs.existsSync(path.join(config.dataPath, "Data")))
                throw Error("User Data path invalid, no Data directory found");

            linkDir = path.join(config.dataPath, "Data", destDir, name);
        } else {
            throw Error("No User Data path defined in foundryconfig.json");
        }

        if (argv.clean || argv.c) {
            Logger.Warn(`Removing build in ${Logger.Highlight(linkDir)}`);

            await fs.remove(linkDir);
        } else if (!fs.existsSync(linkDir)) {
            Logger.Ok(`Copying build to ${Logger.Highlight(linkDir)}`);
            await fs.symlink(path.resolve("./dist"), linkDir);
        }
        return Promise.resolve();
    } catch (err) {
        await Promise.reject(err);
    }
}

/*********************/
/*		PACKAGE		 */
/*********************/

/**
 * Package build
 */
async function packageBuild() {
    const manifest = getManifest();
    if (manifest === null)
    {
        Logger.Err("Manifest file could not be loaded.");
        throw Error();
    }

    return new Promise((resolve, reject) => {
        try {
            // Remove the package dir without doing anything else
            if (argv.clean || argv.c) {
                Logger.Warn("Removing all packaged files");
                fs.removeSync("package");
                return;
            }

            // Ensure there is a directory to hold all the packaged versions
            fs.ensureDirSync("package");

            // Initialize the zip file
            const zipName = `${manifest.file.name}-v${manifest.file.version}.zip`;
            const zipFile = fs.createWriteStream(path.join("package", zipName));
            const zip = archiver("zip", { zlib: { level: 9 } });

            zipFile.on("close", () => {
                Logger.Ok(zip.pointer() + " total bytes");
                Logger.Ok(`Zip file ${zipName} has been written`);
                return resolve(true);
            });

            zip.on("error", (err) => {
                throw err;
            });

            zip.pipe(zipFile);



            // Add the directory with the final code
            zip.file("dist/module.json", { name: "module.json" });
            zip.file("dist/bundle.js", { name: "bundle.js" });
            zip.glob("dist/*.css", {});

            zip.finalize();
        } catch (err) {
            return reject(err);
        }
    });
}

/*********************/
/*		PACKAGE		 */
/*********************/

/**
 * Update version and URLs in the manifest JSON
 */
function updateManifest(cb: any) {
    const packageJson = fs.readJSONSync("package.json");
    const config = getConfig(),
        manifest = getManifest(),
        rawURL = config.rawURL,
        repoURL = config.repository,
        manifestRoot = manifest!.root;

    if (!config)
        cb(Error("foundryconfig.json not found"));
    if (manifest === null) {
        cb(Error("Manifest JSON not found"));
        return;
    }
    if (!rawURL || !repoURL)
        cb(Error("Repository URLs not configured in foundryconfig.json"));

    try {
        const version = argv.update || argv.u;

        /* Update version */

        const versionMatch = /^(\d{1,}).(\d{1,}).(\d{1,})$/;
        const currentVersion = manifest!.file.version;
        let targetVersion = "";

        if (!version) {
            cb(Error("Missing version number"));
        }

        if (versionMatch.test(version)) {https://map.leagueoflegends.com/en_US
            targetVersion = version;
        } else {
            targetVersion = currentVersion.replace(versionMatch, (substring: string, major: string, minor: string, patch: string) => {
                console.log(substring, Number(major) + 1, Number(minor) + 1, Number(patch) + 1);
                if (version === "major") {
                    return `${Number(major) + 1}.0.0`;
                } else if (version === "minor") {
                    return `${major}.${Number(minor) + 1}.0`;
                } else if (version === "patch") {
                    return `${major}.${minor}.${Number(patch) + 1}`;
                } else {
                    return "";
                }
            });
        }

        if (targetVersion === "") {
            return cb(Error("Error: Incorrect version arguments."));
        }

        if (targetVersion === currentVersion) {
            return cb(Error("Error: Target version is identical to current version."));
        }

        Logger.Ok(`Updating version number to '${targetVersion}'`);

        packageJson.version = targetVersion;
        manifest.file.version = targetVersion;

        /* Update URLs */

        console.log(manifest.file);
        const result = `${rawURL}/v${manifest.file.version}/package/${manifest.file.name}-v${manifest.file.version}.zip`;

        manifest.file.url = repoURL;
        manifest.file.manifest = `${rawURL}/master/${manifestRoot}/${manifest.name}`;
        manifest.file.download = result;

        const prettyProjectJson = stringify(manifest.file, {
            maxLength: 35,
            indent: "\t",
        });

        fs.writeJSONSync("package.json", packageJson, { spaces: "\t" });
        fs.writeFileSync(path.join(manifest.root, manifest.name), prettyProjectJson, "utf8");

        return cb();
    } catch (err) {
        cb(err);
    }
}

function gitAdd() {
    return gulp.src("package").pipe(git.add({ args: "--no-all" }));
}

function gitCommit() {
    const manifest = getManifest();
    if (manifest === null)
    {
        throw Error("Could not load manifest.");
    }
    return gulp.src("./*").pipe(
        git.commit(`v${manifest.file.version}`, {
            args: "-a",
            disableAppendPaths: true,
        })
    );
}

function gitTag() {
    const manifest = getManifest();
    if (manifest === null)
    {
        throw Error("Could not load manifest.");
    }
    return git.tag(`v${manifest.file.version}`, `Updated to ${manifest.file.version}`, (err: Error | undefined) => {
        if (err)
            throw err;
    });
}

const execGit = gulp.series(gitAdd, gitCommit, gitTag);

const execBuild = gulp.parallel(buildTS, buildLess, copyFiles);

exports.build = gulp.series(clean, execBuild, bundleModule, cleanDist);
exports.watch = buildWatch;
exports.clean = clean;
exports.link = linkUserData;
exports.package = packageBuild;
exports.update = updateManifest;
exports.publish = gulp.series(clean, updateManifest, execBuild, bundleModule, cleanDist, packageBuild, execGit);
