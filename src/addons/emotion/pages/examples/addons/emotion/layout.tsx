import { Animated, Basic, bounce, Combined } from 'addons/emotion/styles/theme'

const EmotionExample = () => {

  return (
    <>
      <header style={{ margin: '1rem 0' }}>
        Header
      </header>
      <main >
        <h2>Emotion Example</h2>
        <Basic>Cool Styles</Basic>
        <Combined>
          With <code>:hover</code>.
        </Combined>
        <Animated animation={bounce}>Let's bounce.</Animated>
      </main>
      <footer style={{ position: 'fixed', width: '100%', bottom: 0, textAlign: 'center', padding: '1rem 0' }}>
        Footer
      </footer>
    </>

  );

}

export default EmotionExample;