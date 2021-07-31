import Footer from "../components/home/footer";
import Nav from "../components/home/nav";
import How from "../components/how";
export default function Home() {
  return (
    <div>
      <Nav />
      <main className="md:mb-32 md:mt-52 mt-32 mb-24">
        <How />
      </main>
      <Footer />
    </div>
  );
}
