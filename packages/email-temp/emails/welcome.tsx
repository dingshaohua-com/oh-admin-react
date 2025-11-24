import { render } from '@react-email/components';

export default function WelcomeEmail() {
  return (
    <div>
      <h1>Welcome to React Email!</h1>
    </div>
  );
}

export function renderWelcomeEmail () {
  return render(WelcomeEmail());
};
