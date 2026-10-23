import { heroPreloadPayload } from "@/lib/hero-images";
import { THEME_KEY } from "@/lib/theme-key";

/**
 * Render-blocking on purpose (it's ~600 bytes): decides day/night before first paint
 * (saved choice → else visitor's local hour, day = 07:00–18:59) and preloads ONLY the hero
 * image for that mode + viewport. The hero <img>s themselves are lazy so the hidden mode's
 * photo is never fetched.
 */
export function ThemeScript() {
  const payload = JSON.stringify(heroPreloadPayload());
  const code = `(function(p){try{var d=document.documentElement,t=null;try{t=localStorage.getItem(${JSON.stringify(THEME_KEY)})}catch(e){}
if(t!=="day"&&t!=="night"){var h=new Date().getHours();t=h>=7&&h<19?"day":"night"}d.dataset.theme=t;
var s=p[t],m=["(max-width: 767.98px)",p.bp];for(var i=0;i<2;i++){var l=document.createElement("link");l.rel="preload";l.as="image";
l.setAttribute("imagesrcset",s[i]);l.setAttribute("imagesizes",p.sizes);l.media=m[i];l.setAttribute("fetchpriority","high");document.head.appendChild(l)}}catch(e){}})(${payload})`;
  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}
