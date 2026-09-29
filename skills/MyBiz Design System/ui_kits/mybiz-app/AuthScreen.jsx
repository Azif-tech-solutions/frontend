function AuthScreen({ onContinue }) {
  const {Button, Input, Icon} = window.MyBizDesignSystem_c77ec7;
  const [email, setEmail] = React.useState('alex@northwind.com');
  return (
    <div style={{ minHeight: '100%', display: 'flex', justifyContent: 'center', paddingTop: 96, background: 'var(--surface-page)' }}>
      <div style={{ width: 408 }}>
        <img src="../../assets/mark.svg" width="34" height="34" alt="" />
        <h1 style={{ font: 'var(--type-h1)', fontSize: 'var(--text-4xl)', letterSpacing: 'var(--ls-tighter)', color: 'var(--text-strong)', margin: '28px 0 34px' }}>Welcome to MyBiz</h1>
        <Input label="Work email" size="lg" value={email} onChange={e => setEmail(e.target.value)} />
        <Button size="lg" fullWidth style={{ marginTop: 18 }} onClick={onContinue}>Continue with email</Button>
        <div style={{ textAlign: 'center', font: 'var(--type-caption)', color: 'var(--text-muted)', margin: '18px 0' }}>or</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <Button size="lg" fullWidth variant="secondary" onClick={onContinue}>Continue with <b>Single Sign On</b></Button>
          <Button size="lg" fullWidth variant="secondary" iconLeft="chrome" onClick={onContinue}>Continue with <b>Google</b></Button>
          <Button size="lg" fullWidth variant="secondary" iconLeft="apple" onClick={onContinue}>Continue with <b>Apple</b></Button>
        </div>
        <div style={{ font: 'var(--type-caption)', color: 'var(--text-muted)', marginTop: 40, lineHeight: 1.9 }}>
          By creating an account you agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.<br />
          Manage your cookie preferences <a href="#">here</a>.
        </div>
        <div style={{ font: 'var(--type-ui)', color: 'var(--text-muted)', marginTop: 26 }}>Already have an account? <a href="#" onClick={e => { e.preventDefault(); onContinue(); }}>Sign in</a></div>
      </div>
    </div>
  );
}
Object.assign(window, { AuthScreen });
