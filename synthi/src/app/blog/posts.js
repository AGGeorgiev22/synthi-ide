export const POSTS = [
  {
    slug: "introducing-zilm",
    category: "Product announcement",
    date: "August 21, 2026",
    theme: "announcement",
    title: "Introducing ZILM: project-agnostic GPU hot module replacement",
    summary:
      "Today we are launching ZILM. Change GPU code, preserve runtime state, and see the result in milliseconds.",
    image: "/zilm-cover.png",
    alt: "ZILM GPU HMR product artwork with spectral light and the ZILM wordmark",
    sections: [
      {
        heading: "Change the code without rebuilding the world",
        body: [
          "GPU work carries expensive context. A compiled application, a loaded model, a renderer in motion, or the exact state that made a bug visible. Every full rebuild throws that context away before you can see whether the change helped.",
          "ZILM keeps the running application alive while the code changes. It is project-agnostic GPU hot module replacement for the systems that do not fit a template.",
        ],
      },
      {
        heading: "Drop it into the project you already have",
        body: [
          "ZILM requires zero configuration and no ZILM-specific code. Bring the project, language, and runtime that already matter to your team. CUDA, ROCm, CUTLASS, custom kernels, neural networks, renderers, and larger GPU applications are all in scope.",
          "Runtime state is preserved across edits, even when those edits change memory layouts. The session stays where you left it so the next iteration starts from the same evidence, not a recreated approximation.",
        ],
      },
      {
        heading: "A tighter loop for people and agents",
        body: [
          "The current target is under 50ms from edit to visual and under 90ms for an agent to make a change and verify it through the running application. That is enough time to keep the result in the same thought as the change.",
          "ZILM is available on Vectant today. Bring the GPU project that is slowing you down and start with the live loop.",
        ],
      },
    ],
  },
  {
    slug: "the-cache-stampede",
    category: "Scalability",
    educational: true,
    title: "The cache stampede",
    summary: "A cache stampede is not a cache problem. It is a coordination problem that begins at expiry.",
    image: "/blog/cache-stampede-hero.png",
    alt: "Dark data center aisle with server racks, cooling equipment, and restrained amber service lights",
    sections: [
      {
        heading: "Expiry is a synchronized starting gun",
        body: [
          "A cached value feels quiet right up until its expiry. Then the next request has no answer, so it asks the origin. If a hundred requests arrive at nearly the same moment, they can all discover the same miss and all make the same expensive request.",
          "The cache did not merely stop helping. Its shared expiry turned many independent readers into one correlated burst. That is why an otherwise healthy database, API, or rendering tier can suddenly look overloaded at the exact moment a popular key goes cold.",
        ],
      },
      {
        heading: "Let one request do the refresh",
        body: [
          "The most direct response is request coalescing, often called single-flight. The first request that notices a miss becomes the refresher. Other requests for the same key wait for its result instead of starting their own identical fetch.",
          "The detail that matters is scope. Coalescing inside one process helps one process. A fleet needs a shared coordination mechanism or a cache layer that can protect the origin across instances. Whichever approach you use, put a timeout on the refresh lock and make the failed-refresh path explicit. A stuck lock is just a quieter outage.",
        ],
      },
      {
        heading: "Serve stale data on purpose",
        body: [
          "For data that can be a little old, stale-while-revalidate changes the trade. Return the last known response immediately, then refresh it in the background. The reader keeps moving and the refresh work becomes a controlled event instead of a pile-on at the origin.",
          "This is not permission to hide every failure behind old data. Decide which responses can safely age, how long they can age, and what the user should see when they cannot. Price quotes and authorisation checks deserve different rules from a product thumbnail or a documentation page.",
        ],
      },
      {
        heading: "Spread renewal across time",
        body: [
          "A uniform time-to-live gives every key the same appointment with failure. Add bounded jitter to expirations, pre-warm the keys that have predictable demand, or refresh ahead of expiry when the source has room. The goal is not randomness for its own sake. It is to stop identical work from choosing the same second.",
          "Jitter also belongs in retries. If every client retries on the same schedule, a partial failure becomes a metronome that keeps hitting a struggling dependency. Backoff creates space. Jitter stops that space from lining up again.",
        ],
      },
      {
        heading: "Protect the origin after the miss",
        body: [
          "Even a careful cache will miss sometimes. The origin still needs a budget: concurrency limits, queue depth, deadlines, and a response when the budget is gone. It may be better to serve a deliberately limited response, return a retryable error, or shed optional work than to let every caller wait until the whole tier runs out of connections.",
          "The useful dashboard question is not only cache hit rate. Ask how many refreshes are in flight for the same key, how old the served values are, how long callers wait after a miss, and whether the origin is doing duplicate work. Those signals describe the coordination problem before it becomes an outage.",
        ],
      },
    ],
    sources: [
      {
        label: "RFC 5861: stale-while-revalidate and stale-if-error",
        href: "https://www.rfc-editor.org/rfc/rfc5861.html",
      },
      {
        label: "AWS Builders' Library: Timeouts, retries, and backoff with jitter",
        href: "https://aws.amazon.com/builders-library/timeouts-retries-and-backoff-with-jitter/",
      },
      {
        label: "Redis documentation: EXPIRE",
        href: "https://redis.io/docs/latest/commands/expire/",
      },
    ],
  },
  {
    slug: "agents-need-a-work-queue",
    category: "ML agents",
    educational: true,
    title: "Agents need a work queue",
    summary: "Once an agent retries, calls tools, and waits on a worker, its useful failure modes stop being local.",
    image: "/blog/agent-workers-hero.png",
    alt: "Industrial sorting facility with controlled conveyor lanes and neutral crates moving through a queue",
    sections: [
      {
        heading: "A tool call is a distributed-systems boundary",
        body: [
          "An agent can look like a single loop: read context, choose a tool, inspect the result, continue. The moment that tool reaches a service, a browser, a repository, or a queue, the loop crosses a boundary where timeouts, partial results, duplicate requests, and restarts are normal.",
          "That changes the design question. Instead of asking whether the model will make the right next choice, also ask what happens when the choice takes two minutes, succeeds after the caller times out, or returns after the agent has already made another plan.",
        ],
      },
      {
        heading: "Make work resumable, not merely retryable",
        body: [
          "A durable worker needs enough state to continue after a process disappears: the task input, an operation identifier, the current step, the result so far, and a record of what has already caused a side effect. Put that state somewhere the next worker can inspect, not only in the model context that vanished with the first process.",
          "Retries without state create a second agent that guesses what the first agent did. A resumable task gives the replacement a receipt. It can decide to continue, reconcile, or ask for review from a known point instead of replaying a whole chain blindly.",
        ],
      },
      {
        heading: "Bound the loop before it meets the queue",
        body: [
          "Set an overall deadline, a tool-call budget, a maximum concurrency, and a per-step timeout. Those limits turn an unbounded conversation into a piece of work with a cost. They also make overload visible early: a queue growing faster than workers can acknowledge is a capacity signal, not a prompt-quality problem.",
          "Prefetch is part of that contract. Letting a worker reserve too much work can improve a benchmark while hiding a growing buffer of unacknowledged tasks. Tune the number against the job duration, failure rate, and memory budget. The right number is a property of the workload, not a constant copied from another service.",
        ],
      },
      {
        heading: "Retries need a memory",
        body: [
          "A timeout says the caller does not know whether an action happened. It does not say the action did not happen. Give every mutation a stable operation ID, record the outcome with the side effect where possible, and return the same semantic result when that ID appears again.",
          "This is idempotency in practical terms. The worker can retry a network failure without creating a second ticket, charging a second invoice, or sending a second destructive command. It is especially important for agents because their natural response to uncertainty is often to try again with slightly different words.",
        ],
      },
      {
        heading: "A queue is a contract, not a buffer",
        body: [
          "A queue does more than absorb bursts. It defines when work is accepted, when it is acknowledged, what is redelivered, and where work goes when it keeps failing. Those decisions belong in the task protocol, with visible retry counts and an operator path for a poisoned job.",
          "The most trustworthy agent systems treat their queue like an operations surface. A person should be able to see why a task is waiting, which attempt owns it, what it is allowed to call next, and how to stop it. That is how a model loop becomes serviceable infrastructure.",
        ],
      },
    ],
    sources: [
      {
        label: "AWS Builders' Library: Making retries safe with idempotent APIs",
        href: "https://aws.amazon.com/builders-library/making-retries-safe-with-idempotent-APIs/",
      },
      {
        label: "RabbitMQ documentation: Consumer prefetch",
        href: "https://www.rabbitmq.com/docs/3.13/consumer-prefetch",
      },
      {
        label: "RabbitMQ documentation: Consumer acknowledgements and publisher confirms",
        href: "https://www.rabbitmq.com/docs/next/confirms",
      },
    ],
  },
  {
    slug: "the-second-webhook-is-the-real-test",
    category: "How to",
    educational: true,
    title: "The second webhook is the real test",
    summary: "Build for retries, reordering, and duplicate delivery before you build for the happy path.",
    image: "/blog/idempotent-webhooks-hero.png",
    alt: "Close view of a hardened network relay cabinet with paired modules and neatly routed braided cables",
    sections: [
      {
        heading: "Assume every event can arrive twice",
        body: [
          "Webhook delivery is a request across a boundary you do not control. If the sender cannot tell whether your endpoint accepted an event, it will often retry. That is sensible behaviour, but it means the same event can reach your code more than once. Separate events can also arrive in an order your database never expected.",
          "Make duplicate handling part of the first design. Keep a durable record keyed by the provider's event ID, or by a provider-approved combination that represents the underlying event. If the key already exists, return a successful acknowledgement without repeating the side effect.",
        ],
      },
      {
        heading: "Verify before you trust the payload",
        body: [
          "Check the provider's signature against the original request body before you parse and act on it. Signature verification is about proving the request came from a trusted sender and that the body was not changed on the way to your handler.",
          "This detail is easy to lose in framework middleware. Some parsers consume or transform the body before your verification code sees it. Keep a route that exposes the raw payload exactly as the provider signed it, verify it, then decode it. Reject requests that fail verification before they become work.",
        ],
      },
      {
        heading: "Store the receipt with the side effect",
        body: [
          "The awkward failure is a crash after you change your database but before you record that the event was processed. The retry arrives and you have no receipt. Where your storage permits it, write the event receipt and the business mutation in the same transaction.",
          "If the side effect lives in another system, carry an idempotency key into that system too. The aim is not to prove that networks never fail. It is to make a repeated delivery converge on one business outcome instead of multiplying it.",
        ],
      },
      {
        heading: "Return quickly, work deliberately",
        body: [
          "A webhook endpoint should normally validate, persist a minimal receipt, enqueue the real work, and acknowledge promptly. Long-running enrichment, API calls, email, or file processing belongs in a worker where it can be retried, measured, and limited without forcing the sender to guess whether your endpoint is alive.",
          "That separation also gives you a clean overload policy. You can protect the worker queue, delay optional work, and expose a backlog without making the delivery provider create an escalating storm of HTTP retries.",
        ],
      },
      {
        heading: "Replays are part of the protocol",
        body: [
          "A good webhook system can replay an event safely, inspect its attempts, and explain why it was ignored, deferred, or completed. Keep enough of the validated payload, metadata, and processing result to debug a dispute without relying on a transient log line.",
          "Test the second delivery on purpose. Send the same event twice. Send a later event before an earlier one. Simulate a timeout after the side effect. If the system reaches the same final state each time, the happy path has earned some trust.",
        ],
      },
    ],
    sources: [
      {
        label: "Stripe documentation: Receive Stripe events in your webhook endpoint",
        href: "https://docs.stripe.com/webhooks?lang=node",
      },
      {
        label: "Stripe documentation: Resolve webhook signature verification errors",
        href: "https://docs.stripe.com/webhooks/signature",
      },
      {
        label: "AWS Builders' Library: Making retries safe with idempotent APIs",
        href: "https://aws.amazon.com/builders-library/making-retries-safe-with-idempotent-APIs/",
      },
    ],
  },
  {
    slug: "what-zero-downtime-deploys-actually-do",
    category: "Dev infrastructure",
    educational: true,
    title: "What zero-downtime deploys actually do",
    summary: "It is not a switch flip. It is controlled overlap: wait, route, drain, then remove.",
    image: "/blog/zero-downtime-deploy-hero.png",
    alt: "Data center corridor with an open server rack during a maintenance window",
    sections: [
      {
        heading: "The real problem is traffic",
        body: [
          "A deployment changes code, but users experience it as traffic. Requests already in flight might hold a connection open. Queues may be mid-consume. A browser could be retrying at the exact moment an old process disappears.",
          "Zero downtime is therefore not one property that a platform turns on. It is an agreement between the application, its traffic layer, its orchestrator, and its data model about how a new version is allowed to enter service while the old version leaves.",
        ],
      },
      {
        heading: "A new instance has to earn traffic",
        body: [
          "Starting a process is not the same as being ready to serve. The binary might have launched while dependencies are unavailable, caches are cold, migrations are still running, or the service has not yet bound its port.",
          "In Kubernetes, a readiness probe is the signal that determines whether a Pod should receive Service traffic. A useful probe checks a condition that represents the application's ability to do its actual job, not merely whether a process exists.",
        ],
      },
      {
        heading: "For a while, two versions are alive",
        body: [
          "A rolling deployment deliberately creates overlap. New replicas come up, become ready, and join the traffic pool. Only then can old replicas be scaled down within the availability limits chosen for that workload.",
          "That overlap is capacity you pay for in exchange for a safer change. It also makes the hard question visible: can version A and version B both understand the same requests, queues, and database rows for long enough to hand traffic off?",
        ],
        image: "/blog/zero-downtime-deploy-network.png",
        alt: "Close view of fibre patch cables connected to network equipment",
        caption: "Every smooth rollout depends on a temporary period of coexistence, from the traffic layer down to the application instances.",
      },
      {
        heading: "Old instances need time to leave",
        body: [
          "The old process should stop receiving new work before it is terminated. It may still need to finish an HTTP response, acknowledge a message, flush a buffer, or close a database connection cleanly. This is connection draining in practical terms.",
          "Kubernetes gives Pods a termination period and can run a preStop hook. Those mechanics help, but the application still needs to cooperate. A process that ignores its shutdown signal or accepts new work until the last millisecond can turn a careful rollout into a user-visible failure.",
        ],
      },
      {
        heading: "The database crosses the longest bridge",
        body: [
          "Application instances can overlap for minutes. Data outlives them. That is why the safest schema changes are usually additive first: introduce a new column or structure, ship code that can read both shapes, backfill deliberately, and remove the old path only after it is unused.",
          "This expand-and-contract approach feels slower than a one-shot migration. It is faster than discovering that a rollback restored old code against data that old code can no longer interpret.",
        ],
      },
      {
        heading: "A rollback is not an undo button",
        body: [
          "A deployment controller can return a workload to an earlier Pod template. That is useful, but it does not automatically reverse messages already sent, side effects already triggered, or an incompatible schema change.",
          "The useful mental model is choreography, not replacement. A good deployment establishes readiness, overlaps versions, drains traffic, preserves compatibility, and leaves a route back while that route is still meaningful.",
        ],
      },
    ],
    sources: [
      {
        label: "Kubernetes documentation: Deployments",
        href: "https://kubernetes.io/docs/concepts/workloads/controllers/deployment/",
      },
      {
        label: "Kubernetes documentation: Liveness, Readiness, and Startup Probes",
        href: "https://kubernetes.io/docs/concepts/configuration/liveness-readiness-startup-probes/",
      },
      {
        label: "Kubernetes documentation: Pod Lifecycle",
        href: "https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle/",
      },
      {
        label: "Kubernetes tutorial: Pod and endpoint termination flow",
        href: "https://kubernetes.io/docs/tutorials/services/pods-and-endpoint-termination-flow/",
      },
    ],
  },
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
          "The public CodeSite proof shows the path an agent took beside a safer alternative. Agent Dojo now turns reviewed workflows into skills that can be tested in synthetic environments, checked against expected results, and issued with scoped proof. That system runs in the repository today; external production deployment remains gated.",
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
          "A Vectant pilot scopes the agent and extension paths a team wants to bring, then validates compatibility before those paths enter the boundary contract. The operating question is not which agent won. It is whether the system made the work governable.",
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
