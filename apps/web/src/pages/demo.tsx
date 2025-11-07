import { Header, Counter } from '@repo/ui';
import typescriptLogo from '/typescript.svg';

export default function Home() {
  return (
    <div>
      <a href="https://vitejs.dev" target="_blank">
        <img src="/vite.svg" className="logo" alt="Vite logo" />
      </a>
      <a href="https://www.typescriptlang.org/" target="_blank">
        <img src={typescriptLogo} className="logo vanilla" alt="TypeScript logo" />
      </a>
      <Header title="Web" />
      <div className="card">
        <Counter />
      </div>
    </div>
  );
}
