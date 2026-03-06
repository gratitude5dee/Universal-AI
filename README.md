# UniversalAI ✨ : Every Being is A Billion
### *Cultivate your Creator - Make Magic Real Again*

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Solana](https://img.shields.io/badge/Solana-9945FF?logo=solana&logoColor=white)](https://solana.com/)

UniversalAI ✨ — Cultivate your Creator, Make Magic Real Again

Welcome to UniversalAI, a next-generation creator hub where intelligent agents and blockchain infrastructure co-create alongside you. Spin up specialized AI companions, orchestrate smart workflows, and manage every asset—from NFT collections to revenue streams—inside a single, secure command center. Dive into Agents.md for deep architectural diagrams that unpack how each agent collaborates across Supabase, thirdweb, Crossmint custody flows, and pgvector-backed knowledge stores.

Why creators choose UniversalAI

AI-Powered Creation — Launch and customize marketplace agents, unlock WZRD Studio for AI-assisted production, and automate tedious loops so you can focus on storytelling.

Blockchain & Security — Protect IP with Solana’s speed, thirdweb-powered EVM wallet UX, Crossmint custodial treasury flows, and decentralized storage that keeps digital work tamper-resistant and verifiable.

Creator Economy Ops — Manage treasury flows, diversify monetization channels, and track performance with analytics tuned for creator-led organizations.

Distribution & Growth — Publish everywhere from a single dashboard, automate social drops, and cultivate communities with built-in engagement loops.

Creative Asset Suite — Catalog every render, collection, and licensing agreement with tools designed for NFT-native and traditional creators alike

---

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern component-based UI framework
- **TypeScript** - Type-safe development environment
- **Vite** - Lightning-fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework for rapid styling
- **shadcn/ui** - Beautiful, accessible component library
- **Framer Motion** - Powerful animation and gesture library

### Blockchain & Web3
- **Solana** - High-performance blockchain platform
- **thirdweb** - Primary EVM wallet, contract reads/writes, and creator-facing onchain UX
- **Crossmint** - Custodial wallet creation and guarded treasury execution
- **Web3.js** - Ethereum and multi-chain blockchain interactions

### State & Data Management
- **TanStack Query** - Powerful data synchronization for React
- **React Router** - Declarative routing for single-page applications
- **Context API** - Global state management

### 3D & Graphics
- **Three.js** - 3D graphics library for immersive experiences
- **React Three Fiber** - React renderer for Three.js

### Development Tools
- **ESLint** - Code linting and quality assurance
- **TypeScript** - Static type checking
- **Vite** - Module bundling and hot module replacement

---

## 🚀 Quick Start

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18.0.0 or higher) - [Download here](https://nodejs.org/)
- **npm** (v8.0.0 or higher) - Comes with Node.js
- **Git** - [Download here](https://git-scm.com/)

### Installation

1. **Clone the repository**
   ```bash
   git clone <YOUR_GIT_URL>
   cd <YOUR_PROJECT_NAME>
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Copy `.env.example` to `.env.local` and define the required Vite variables:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_THIRDWEB_CLIENT_ID=your_thirdweb_client_id
   ```
   *Note: The frontend uses thirdweb for creator-facing EVM wallet UX. `VITE_SUPABASE_ANON_KEY` can also be mirrored into `VITE_SUPABASE_PUBLISHABLE_KEY` for components that expect that name.*

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173` to see the application running.

### Alternative Installation Methods

**Using Yarn:**
```bash
yarn install
yarn dev
```

**Using Docker:**
```bash
docker build -t universalai .
docker run -p 5173:5173 universalai
```

---

## ⚙️ Configuration

### Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Supabase Configuration (Required for backend services)
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key

# thirdweb Configuration (Required for creator-facing EVM features)
VITE_THIRDWEB_CLIENT_ID=your_thirdweb_client_id

# Optional: enable browser wallet writes in development
VITE_ENABLE_WEB3_WRITES=false

# Optional: local fallback contract and token maps
VITE_THIRDWEB_CONTRACTS_JSON={}
VITE_PAYMENT_TOKENS_JSON={}

# Optional: Development/Production Mode
NODE_ENV=development
```

### thirdweb Setup

1. Visit the thirdweb dashboard and create or select a project
2. Copy your client ID
3. Add `VITE_THIRDWEB_CLIENT_ID` to `.env.local`
4. Optionally configure `get-thirdweb-config` in Supabase to serve client and contract metadata dynamically

### Crossmint Setup

1. Configure Crossmint server credentials only for custodial wallet and treasury flows
2. Keep Crossmint keys in Supabase env or MCP env, not in frontend Vite env
3. Use `create-wallet` and `transfer-sol` only for custodial/operator flows

### Supabase Setup (Optional)

For full blockchain functionality:

1. Create a [Supabase](https://supabase.com/) project
2. Deploy the provided serverless functions:
   ```bash
   supabase functions deploy get-thirdweb-config
   supabase functions deploy wallet-link-start
   supabase functions deploy wallet-link-complete
   supabase functions deploy launch-clanker-preflight
   supabase functions deploy launch-bags-session
   supabase functions deploy bankr-automation-session
   supabase functions deploy engine-admin-execute
   supabase functions deploy create-wallet
   supabase functions deploy transfer-sol
   ```
3. Apply database migrations, including the provider-boundary migration in `supabase/migrations/20260306123000_provider_boundary_foundation.sql`
4. Add your Supabase credentials to `.env.local`

### MCP Server Setup Overview

The `/mcp` package contains the Model Context Protocol server that powers UniversalAI's agent tooling surface—bridging orchestrators, Supabase workflows, Crossmint wallets, and retrieval resources.

**Critical MCP environment variables**

- `MCP_BEARER_TOKEN` – shared secret required to authenticate orchestrator requests.
- `MCP_PORT` – HTTP port for the MCP server (defaults to `8974`).
- `MCP_MODE` – `mock` for local development or `live` for production calls.
- `MCP_SUPABASE_URL` – base URL of your Supabase instance.
- `MCP_SUPABASE_SERVICE_ROLE_KEY` – service-role key for privileged database and RPC access.
- `MCP_SUPABASE_FUNCTION_JWT` – JWT used when invoking Supabase Edge Functions.
- `MCP_CROSSMINT_API_KEY` & `MCP_CROSSMINT_PROJECT_ID` – credentials for Crossmint wallet operations.
- `MCP_WALLET_CONFIRMATION_SECRET` – HMAC secret protecting high-trust wallet flows.
- `MCP_WEB_SEARCH_API_KEY` – key for outbound web search providers.
- `MCP_EMBEDDING_API_KEY` – key for embedding generation used by knowledge search.

For setup scripts, tool allowlists, and run commands, read the dedicated [MCP server guide](mcp/README.md). You can also revisit [Agents.md](Agents.md) for diagrams showing how the orchestrator and MCP server interact across the full agent architecture.

---

## 🎯 Usage

### Basic Usage

After starting the development server, you can:

1. **Explore the Landing Page** - Visit `/` to see the main landing page
2. **Access Creator Tools** - Navigate to `/home` for the main dashboard
3. **Create AI Agents** - Use `/create-agent` to build custom AI assistants
4. **Manage Assets** - Visit `/gallery` to organize your digital assets
5. **Treasury Management** - Access `/treasury` for financial tools

### Code Examples

**Creating a Custom Component:**
```tsx
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export function CustomCreatorTool() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 bg-white rounded-lg shadow-lg"
    >
      <h2 className="text-2xl font-bold mb-4">Creator Tool</h2>
      <Button onClick={() => console.log("Tool activated!")}>
        Activate Tool
      </Button>
    </motion.div>
  );
}
```

**Using the EVM Wallet Context:**
```tsx
import { useEvmWallet } from "@/context/EvmWalletContext";
import { ConnectWalletButton } from "@/components/web3/ConnectWalletButton";

export function WalletDisplay() {
  const { address, nativeBalance, chainMeta } = useEvmWallet();
  
  return (
    <div>
      {address ? (
        <div>
          <p>Connected: {address}</p>
          <p>
            Balance: {nativeBalance?.formatted} {chainMeta?.nativeSymbol}
          </p>
        </div>
      ) : (
        <ConnectWalletButton />
      )}
    </div>
  );
}
```

---

## 🧪 Testing

### Running Tests

```bash
# Run the UniversalAI-owned test suite
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage reporting
npm run test:coverage
```

### Testing Philosophy

Our testing strategy focuses on:
- **Component Testing**: Ensuring UI components render correctly
- **Integration Testing**: Verifying feature workflows
- **Blockchain Testing**: Mocking wallet interactions and transactions
- **Accessibility Testing**: Ensuring WCAG compliance

---

## 📦 Building for Production

### Development Build
```bash
npm run build:dev
```

### Production Build
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Deployment

**Deploy to Lovable (Recommended):**
1. Visit [Lovable](https://lovable.dev/projects/b8353fa8-16e6-4fe2-9f52-00d0a7a9630c)
2. Configure preview or production env vars before publishing:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_THIRDWEB_CLIENT_ID`
   - optional `VITE_ENABLE_WEB3_WRITES`
   - optional `VITE_SUPABASE_PUBLISHABLE_KEY` if you do not want it to alias the anon key
3. Confirm the build command is `npm run build`
4. Confirm the output directory is `dist`
5. Publish only after preview verifies the launchpad and integrations routes
6. Click "Share" → "Publish"

**Deploy to Netlify:**
```bash
# Build the project
npm run build

# Deploy to Netlify
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

**Deploy to Vercel:**
```bash
npm install -g vercel
vercel --prod
```

---

## 🤝 Contributing

We welcome contributions from creators, developers, and innovators! Here's how you can get involved:

### Development Setup

1. **Fork the repository** on GitHub
2. **Clone your fork:**
   ```bash
   git clone https://github.com/YOUR_USERNAME/universalai.git
   cd universalai
   ```
3. **Create a feature branch:**
   ```bash
   git checkout -b feature/amazing-new-feature
   ```
4. **Install dependencies:**
   ```bash
   npm install
   ```
5. **Start development server:**
   ```bash
   npm run dev
   ```

### Contribution Guidelines

- **Code Style**: Follow the existing TypeScript and React patterns
- **Components**: Use the established shadcn/ui component library
- **Styling**: Utilize Tailwind CSS classes consistently
- **Testing**: Write tests for new features and components
- **Documentation**: Update relevant documentation

### Pull Request Process

1. Ensure your code follows our linting rules: `npm run lint`
2. Add tests for new functionality
3. Update documentation as needed
4. Create a detailed pull request description
5. Link any relevant issues

### Code of Conduct

We are committed to fostering an inclusive and welcoming community. Please read our [Code of Conduct](CODE_OF_CONDUCT.md) before contributing.

---

## 🐛 Troubleshooting

### Common Issues

**Issue: "Cannot find module" errors**
```bash
# Solution: Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Issue: Vite build fails**
```bash
# Solution: Clear Vite cache
npm run dev -- --force
```

**Issue: thirdweb initialization not working**
- Verify `VITE_THIRDWEB_CLIENT_ID` is set, or that the Supabase edge function `get-thirdweb-config` is deployed
- Check the browser console for `Web3 Initialization Error`
- Confirm preview env vars were added in Lovable before publishing

**Issue: custodial wallet flow not working**
- Verify the Supabase functions `create-wallet` and `transfer-sol` are deployed
- Verify Crossmint server credentials are configured in Supabase or MCP env
- Confirm you are testing a treasury/operator flow, not the primary creator wallet flow

**Issue: Three.js performance issues**
- Check if hardware acceleration is enabled in your browser
- Try reducing the complexity of 3D scenes
- Update your graphics drivers

**Issue: Wallet connection fails**
- Clear browser cache and cookies
- Try in an incognito/private browsing window
- Ensure popup blockers are disabled

### Getting Help

- **GitHub Issues**: [Create an issue](https://github.com/YOUR_REPO/issues)
- **Documentation**: Check our [Wiki](https://github.com/YOUR_REPO/wiki)
- **Community**: Join our [Discord server](https://discord.gg/universalai)

---

## 🗺️ Roadmap

### Q1 2025
- [ ] Enhanced AI agent capabilities
- [ ] Advanced analytics dashboard
- [ ] Mobile application (React Native)
- [ ] Multi-chain blockchain support

### Q2 2025
- [ ] Creator monetization marketplace
- [ ] Advanced rights management tools
- [ ] Social media automation features
- [ ] Community features and forums

### Q3 2025
- [ ] Enterprise creator tools
- [ ] API for third-party integrations
- [ ] Advanced 3D content creation tools
- [ ] VR/AR content support

### Long-term Vision
- Global creator ecosystem with millions of users
- Industry-standard tools for digital rights management
- Seamless cross-platform content distribution
- AI-powered content optimization and insights

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2025 UniversalAI

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 🙏 Acknowledgments

### Inspirations & Credits
- **Solana Foundation** - For providing robust blockchain infrastructure
- **Crossmint Team** - For seamless wallet integration solutions
- **Vercel & Lovable** - For excellent deployment platforms
- **shadcn** - For the beautiful UI component library
- **Three.js Community** - For amazing 3D graphics capabilities

### Third-Party Resources
- **Fonts**: Neue Machina, Inter (Google Fonts)
- **Icons**: Lucide React icon library
- **Animations**: Framer Motion animation library
- **3D Models**: Various Creative Commons assets

### Special Thanks
- Our amazing community of creators and developers
- Beta testers who provided invaluable feedback
- Open source contributors who made this project possible

---

## 📞 Contact & Support

### Links
- **🌐 Website**: [UniversalAI Official Site](https://universalai.dev)
- **📱 App**: [Lovable Project](https://lovable.dev/projects/b8353fa8-16e6-4fe2-9f52-00d0a7a9630c)
- **📚 Documentation**: [Full Documentation](https://docs.universalai.dev)
- **💬 Community**: [Join our Discord](https://discord.gg/universalai)
- **🐦 Social**: [@UniversalAI](https://twitter.com/universalai)

### Support
- **📧 Email**: support@universalai.dev
- **🆘 Issues**: [GitHub Issues](https://github.com/YOUR_REPO/issues)
- **💡 Feature Requests**: [GitHub Discussions](https://github.com/YOUR_REPO/discussions)

---

<div align="center">

**Made with ❤️ by the UniversalAI Team**

*Cultivate your Creator - Make Magic Real Again* ✨

[🚀 Get Started](#-quick-start) • [📖 Documentation](https://docs.universalai.dev) • [🤝 Contributing](#-contributing) • [🐛 Report Bug](https://github.com/YOUR_REPO/issues)

</div>
