
/**
 * Dynamically loads script callsback on loaded.
 * 
 * @example
 * import loader from 'path/to/loader.ts';
 * const [loaded, setLoaded] = useState(false);
 * useEffect(() => {  
 *    const unloader = loader('my_name', 'https://somepath.com', () => {
 *      setLoaded(true);
 *    });
 *    return () => {
 *       unloader(); // removes script.
 *    };
 * });
 * 
 * @param name the name of the script.
 * @param src the source path for the script.
 * @param cb optional callback.
 */
export default function loadScript(name: string, src: string, cb?: (loaded?: boolean) => void) {

  if (typeof window === 'undefined')
    return;

  cb = cb || ((v) => v);

  let script = document.getElementById(name) as HTMLScriptElement;

  if (!script) {

    script = document.createElement('script');
    script.setAttribute('id', name);
    script.src = src;

    try {
      script.onload = () => cb(true);
    }
    catch (ex) {
      cb(false);
    }

  }

  if (script && cb)
    cb(true);

  // Removes script if exists.
  return () => {
    if (script)
      script.parentNode.removeChild(script);
  };

}