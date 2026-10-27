
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Demo DNSSEC test data
const dnsTests = [
  {
    domain: "secure.lab.test",
    status: "SECURE",
    result: "NOERROR",
    authenticated: true,
  },
  {
    domain: "insecure.lab.test",
    status: "INSECURE",
    result: "NOERROR",
    authenticated: false,
  },
  {
    domain: "www.bogus.lab.test",
    status: "BOGUS",
    result: "SERVFAIL",
    authenticated: false,
  },
];

// 1. Backend health check
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    service: "DNSGuard API",
    mode: "demo",
    resolverConnected: false,
    message: "Backend running. Live Unbound integration is pending.",
  });
});

// 2. Get DNSSEC test cases
app.get("/api/queries", (req, res) => {
  res.json({
    success: true,
    mode: "demo",
    count: dnsTests.length,
    data: dnsTests,
  });
});

// 3. Run a demo DNSSEC test
app.post("/api/dnssec/test", (req, res) => {
  const { domain } = req.body;

  if (!domain || typeof domain !== "string") {
    return res.status(400).json({
      success: false,
      error: "Please provide a valid domain.",
    });
  }

  const test = dnsTests.find(
    (item) => item.domain === domain.trim().toLowerCase()
  );

  if (!test) {
    return res.status(404).json({
      success: false,
      error: "Domain not found in the demo test zones.",
      availableDomains: dnsTests.map((item) => item.domain),
    });
  }

  res.json({
    success: true,
    mode: "demo",
    resolverConnected: false,
    message: "Simulated result — not a live DNS query.",
    data: test,
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`DNSGuard API running at http://localhost:${PORT}`);
});
