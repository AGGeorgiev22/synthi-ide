export const POSTS = [
  {
    slug: "live-state-is-a-control-surface",
    category: "Runtime",
    title: "Live state is a control surface",
    summary: "A diff can explain a change. It cannot prove what the running system did with it.",
    image: "/product-proof/browser-workspace-loaded.png",
    alt: "Vectant workspace running a web application inside the browser",
    sections: [
      {
        heading: "A worktree is not a runtime",
        body: [
          "Agent work is often judged from the artifacts it leaves behind: a patch, a pull request, a test result. Those artifacts matter. They are still an incomplete account of a production-facing change.",
          "The relevant question is what the application did while it was running. Which process held the port? What was visible in the browser? Did the change preserve the state the operator was already using? A control surface starts where static artifacts stop.",
        ],
      },
      {
        heading: "Attach to the system that already exists",
        body: [
          "Vectant is built around the idea that an agent should inherit an observable environment instead of rebuilding a rough approximation of one. The running application, its ports, files, logs, and browser state are part of the job, not setup noise.",
          "That makes a review more concrete. A human can inspect the same runtime an agent used, with the evidence attached to the action that changed it.",
        ],
      },
      {
        heading: "State changes the shape of authority",
        body: [
          "Authority is easier to grant when the system makes the consequences visible. The goal is not to make agents look autonomous. The goal is to make each useful action legible enough to approve, constrain, or reverse.",
        ],
      },
    ],
  },
  {
    slug: "why-a-denied-write-matters",
    category: "CodeSite",
    title: "Why a denied write matters",
    summary: "A rejected action should leave a useful trail, not disappear into a generic permission error.",
    image: "/product-proof/codesite-line-inspector-ui-desktop.png",
    alt: "CodeSite line inspector showing code change evidence",
    sections: [
      {
        heading: "A denial is part of the record",
        body: [
          "Most agent systems treat a denied write as a dead end. The tool returns an error, the agent tries another route, and the operator is left to reconstruct intent from a scattered conversation.",
          "For production work, the denied action is evidence. It shows which boundary was tested, what the agent attempted to change, and where human review or a narrower permission should enter the loop.",
        ],
      },
      {
        heading: "Proof is more than a passing test",
        body: [
          "A passing test tells you something useful about an outcome. It does not always tell you which operation caused it, what was rejected on the way, or whether the agent worked within the authority it was given.",
          "CodeSite is Vectant's proof surface for connecting operations, code context, and runtime evidence. The point is not surveillance. It is a reviewable chain of cause and effect.",
        ],
      },
      {
        heading: "Make correction cheaper",
        body: [
          "When a denial carries context, the next action can be specific: approve a bounded operation, change the instruction, or keep the boundary in place. That is materially better than either blanket approval or a vague retry loop.",
        ],
      },
    ],
  },
  {
    slug: "counterfactual-memory-needs-a-boundary",
    category: "Evidence",
    title: "Counterfactual memory needs a boundary",
    summary: "Learning from alternate agent paths is useful only when its scope is explicit and inspectable.",
    image: "/product-proof/codesite-counterfactual-memory-proof.png",
    alt: "CodeSite counterfactual memory proof interface",
    sections: [
      {
        heading: "The tempting story",
        body: [
          "It is tempting to describe agent memory as a universal answer: let the system remember every past run and it will steadily become more capable. That story conceals the difficult part. What did it remember, where did it come from, and which future action is allowed to rely on it?",
          "Without a boundary, memory becomes another unreviewed source of authority.",
        ],
      },
      {
        heading: "A narrower current scope",
        body: [
          "Vectant's counterfactual-memory work is implemented in the CodeSite and Dojo proof workflow. It compares an observed path with a constrained alternative so an operator can inspect why one action was preferred over another.",
          "This is deliberately not presented as a universal control plane. The useful claim is smaller: alternate paths can become evidence when their inputs, limits, and result are visible.",
        ],
      },
      {
        heading: "Evidence before confidence",
        body: [
          "A system should earn more latitude from demonstrated, reviewable behaviour. Counterfactual telemetry is valuable when it helps a person see what the agent could have done, what it did instead, and why the boundary held.",
        ],
      },
    ],
  },
  {
    slug: "custom-environments-are-part-of-authority",
    category: "Workspace",
    title: "Custom environments are part of authority",
    summary: "Bring the agent, extensions, and tools. Keep the runtime boundary visible while they work.",
    image: "/product-proof/investor-demo-workspace.png",
    alt: "Vectant workspace with developer tools and a running application",
    sections: [
      {
        heading: "The environment is not neutral",
        body: [
          "An agent's capabilities are shaped as much by its environment as by its model. Extension hosts, MCP servers, browser sessions, local processes, and desktop-class tooling all change what an agent can reach and what it can affect.",
          "Treating that environment as a black box makes control harder precisely when the task becomes consequential.",
        ],
      },
      {
        heading: "Bring the stack you already use",
        body: [
          "Vectant supports a bring-your-own-agent approach, routes compatible VSIX extensions into the appropriate extension runtime, and lets teams compose their workspace around the tools they actually need. The operating question is not which agent won. It is whether the system made the work governable.",
        ],
      },
      {
        heading: "Tomography is a design direction",
        body: [
          "Agent Therapeutic Tomography is a design direction for reading an agent's operating context and applying the minimum effective authority. It is not a claim that automatic authority dosing is already a shipped control plane. The intent is to make the next boundary more specific, not more permissive.",
        ],
      },
    ],
  },
];

export function getPost(slug) {
  return POSTS.find((post) => post.slug === slug);
}
