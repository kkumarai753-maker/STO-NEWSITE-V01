export const articles = [
  {
    slug: "plan-your-business-website",
    category: "Websites",
    title: "What to prepare before your business website is built",
    intro:
      "A useful website starts with a clear brief, not a long feature list.",
    sections: [
      {
        title: "Start with the next action",
        body: "Decide what a visitor should do: enquire, book, shop or request a quote. That action should guide the pages, content and forms you include.",
      },
      {
        title: "Collect the essentials",
        body: "Prepare your approved logo, public contact details, service descriptions and original photographs. Keep account ownership, domain access and content responsibilities clear from the start.",
      },
      {
        title: "Agree what is included",
        body: "List the required pages, product or service content, integrations, review checkpoints and ongoing maintenance. Ask for a written quotation that makes these deliverables explicit.",
      },
    ],
  },
  {
    slug: "social-media-before-paid-ads",
    category: "Social media",
    title: "Before paid ads: build a clear offer and follow-up plan",
    intro:
      "A campaign needs somewhere useful to send people—and a team ready to respond.",
    sections: [
      {
        title: "Make the offer specific",
        body: "Know who the campaign is for, what you are offering and what the next step looks like. Use creative that matches the landing page rather than promising something different.",
      },
      {
        title: "Choose a useful destination",
        body: "Send visitors to a relevant page or enquiry flow. Check that it works on a phone, explains the offer and asks only for the information you need.",
      },
      {
        title: "Measure and respond",
        body: "Agree which outcomes matter, track enquiries where appropriate and assign responsibility for follow-up. Review campaign performance against the agreed objective; reach alone does not demonstrate sales.",
      },
    ],
  },
  {
    slug: "choose-your-first-automation",
    category: "AI & automation",
    title: "How to choose your first business automation",
    intro:
      "Start with one repeatable task where the input and desired result are well understood.",
    sections: [
      {
        title: "Map the current workflow",
        body: "Write down what triggers the task, which tools it touches and what happens when information is missing. A simple map often reveals work that can be simplified before adding AI.",
      },
      {
        title: "Keep people in control",
        body: "Decide what can happen automatically and what needs approval. Customer-facing replies and important decisions need appropriate review, fallback handling and a clear owner.",
      },
      {
        title: "Test a small version first",
        body: "Try representative examples, including mistakes and exceptions. Check that the workflow gives a useful result before expanding it into other parts of the business.",
      },
    ],
  },
] as const;
