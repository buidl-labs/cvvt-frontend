import React from "react";
import Footer from "../components/home/footer";
import Nav from "../components/home/nav";
import { FaTwitter } from "react-icons/fa";

function About() {
  const team = [
    {
      name: "Jonh Doe",
      title: "Product manager",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80",
      twitter: "https://twitter.com/ChurroFi",
    },
    {
      name: "Jonh Doe",
      title: "Product manager",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80",
      twitter: "https://twitter.com/ChurroFi",
    },
    {
      name: "Jonh Doe",
      title: "Product manager",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80",
      twitter: "https://twitter.com/ChurroFi",
    },
    {
      name: "Jonh Doe",
      title: "Product manager",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80",
      twitter: "https://twitter.com/ChurroFi",
    },
  ];
  return (
    <div>
      <Nav />
      <div className="mb-36 pt-16 px-5 lg:px-0">
        <div className="text-center mt-16">
          <p className="text-sm text-gray">Behind the product, here's</p>
          <h2 className="text-gray-dark text-3xl font-medium font-serif mt-2">
            Our Team
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 mt-16 mx-auto max-w-4xl gap-14">
            {team.map((t) => (
              <div key={t.name} className="flex justify-self-center">
                <div className="mr-5">
                  <img
                    src={t.image}
                    className="lg:w-24 lg:h-24 w-20 h-20 rounded-full overflow-hidden object-cover"
                  />
                </div>
                <div className="text-left">
                  <p className="text-gray-dark text-lg font-medium">{t.name}</p>
                  <p className="text-sm text-gray mt-1">{t.title}</p>
                  <div className="mt-2 text-secondary-light-light">
                    <a href={t.twitter} target="_blank">
                      <FaTwitter />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default About;
