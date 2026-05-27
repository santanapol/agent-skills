# Subagents index (Cursor)

Copied from [`agents/`](../../agents/). Re-copy after editing upstream personas.

| Subagent | Role |
|----------|------|
| [code-reviewer.md](./code-reviewer.md) | Five-axis review — correctness, readability, architecture, security, performance |
| [security-auditor.md](./security-auditor.md) | OWASP, threat modeling, secrets |
| [test-engineer.md](./test-engineer.md) | Coverage analysis, Prove-It |

## Usage

- **Direct:** "Use the code-reviewer subagent on this PR."
- **Orchestrated:** `/ship` — parallel fan-out of all three, then merge in main agent.

Personas do not invoke other personas. See [`agents/README.md`](../../agents/README.md) and [`references/orchestration-patterns.md`](../../references/orchestration-patterns.md).
