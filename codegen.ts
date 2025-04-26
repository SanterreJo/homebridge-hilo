import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
	schema: "schema.json",
	documents: ["src/**/*.ts"],
	ignoreNoDocuments: true,
	generates: {
		"./src/graphql/": {
			preset: "client",
			presetConfig: {
				gqlTagName: "gql",
			},
		},
	},
};

export default config;
