export default {
  moduleFileExtensions: ["js", "json", "ts"],
  rootDir: ".",
  testRegex: ".*(\\.spec|\\.e2e-spec)\\.ts$",
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1"
  },
  transform: {
    "^.+\\.(t|j)s$": ["ts-jest", { useESM: true }]
  },
  testEnvironment: "node",
  extensionsToTreatAsEsm: [".ts"]
};
