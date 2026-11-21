import {Command} from "commander";
import esbuild from "esbuild";
import esbuildSvelte from "esbuild-svelte";
import {sveltePreprocess} from "svelte-preprocess";
import fs from "node:fs/promises";

const program = new Command();
program.option("--serve", "Start a watch server")
program.parse();

const options = program.opts();
const serve = options.serve;

await (async function() {
    const distdir = "dist";

    await fs.rm(distdir, {force: true, recursive: true});

    const ctx = await esbuild.context({
        target: ["es2023", "firefox115"],
        entryPoints: [
            {in: "src/bootstrap.ts", out: "app"},
            {in: "src/css/global.css", out: "global"}
        ],
        entryNames: "[ext]/[name]",
        assetNames: "[dir]/[name]",
        publicPath: "/",
        globalName: "itad",
        format: "esm", // to support code splitting
        outdir: distdir,
        bundle: true,
        minify: false,
        mainFields: ["svelte", "browser", "module", "main"],
        conditions: ["svelte", "browser"],
        metafile: false,
        logLevel: "warning",
        logOverride: {
            "suspicious-nullish-coalescing": "silent" // seems like svelte is too safe in some cases and esbuild throws a warning
        },
        plugins: [
            esbuildSvelte({
                preprocess: sveltePreprocess(),
                compilerOptions: {
                    runes: true,
                    css: "injected",
                    dev: false,
                },
                esbuildTsTransformOptions: {
                    loader: "ts"
                }
            })
        ],
        loader: {
            ".svg": "file",
            ".png": "file",
            ".gif": "file",
            ".jpg": "file"
        }
    });

    await fs.cp("index.html", distdir + "/index.html");

    if (serve) {
        await ctx.watch()

        let { hosts, port } = await ctx.serve({
            servedir: distdir,
            host: "127.0.0.1"
        });

        console.log(`Server running at http://${hosts[0]}:${port}`);
    } else {
        await ctx.rebuild();
        await ctx.dispose();
    }
})();
