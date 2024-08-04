Bun.build({
    entrypoints: ["./src/index.ts"],
    outdir: "./dist",
    external: ["@liode/kit"]
})