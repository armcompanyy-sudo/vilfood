import { SmoothScroll } from "./lib/SmoothScroll";
import { Grain } from "./components/Grain";
import { HeadlineChoreo } from "./components/HeadlineChoreo";
import { Cursor } from "./components/Cursor";
import { ScrollProgress } from "./components/ScrollProgress";
import { Nav } from "./components/Nav";
import { Hero } from "./components/sections/Hero";
import { Story } from "./components/sections/Story";
import { Products } from "./components/sections/Products";
import { Process } from "./components/sections/Process";
import { Quality } from "./components/sections/Quality";
import { WhereToBuy } from "./components/sections/WhereToBuy";
import { Contact } from "./components/sections/Contact";
import { Footer } from "./components/sections/Footer";

export default function App() {
  return (
    <SmoothScroll>
      <Grain />
      <Cursor />
      <ScrollProgress />
      <Nav />
      <main>
        <Hero />
        <Story />
        <Products />
        <Process />
        <Quality />
        <WhereToBuy />
        <Contact />
      </main>
      <Footer />
      <HeadlineChoreo />
    </SmoothScroll>
  );
}
