import Footer from "../components/home/footer";
import Nav from "../components/home/nav";
import How from "../components/how";
export default function Home() {
  return (
    <div>
      <Nav />
      <main className="my-32">
        <How />
      </main>
      <Footer />
    </div>
  );
}
