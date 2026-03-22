# Prefer Fixing Framework Over Example Apps

The example apps under `examples/` are integration tests for the framework. When tests fail, the default approach is to fix the framework code (compiler, runtime, reactivity system), not the example apps. The example code represents valid user patterns that the framework must support.

However, if the example app itself has a glaring bug (e.g., wrong test expectation, broken selector, incorrect logic), fix the example app directly.
