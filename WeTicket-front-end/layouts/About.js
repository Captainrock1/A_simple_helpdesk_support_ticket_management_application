import { markdownify } from "@lib/utils/textConverter";
import shortcodes from "@shortcodes/all";
import { MDXRemote } from "next-mdx-remote";
import Image from "next/image";

const About = ({ data }) => {
  const { frontmatter, mdxContent } = data;
  const { title, image, introduce, website } = frontmatter;

  return (
    <section className="section mt-7">
      <div className="container text-center">
        {image && (
          <div className="mb-8 mx-auto lg:col-6 lg:w-1/2">
            <Image
              src={image}
              width={800}
              height={450}
              alt={title}
              className="rounded-lg"
              priority={true}
            />
          </div>
        )}
        {markdownify(title, "h1", "h1 text-left lg:text-[55px] mt-12")}

        <div className="content text-left">
          <MDXRemote {...mdxContent} components={shortcodes} />
        </div>

        <div className="row mt-24 text-left lg:flex-nowrap">
          <div className="lg:col-6 ">
            <div className="rounded border border-border p-6 dark:border-darkmode-border ">
              {markdownify(introduce.title, "h2", "section-title mb-12")}
              <div className="row">
                {introduce.detail.map((detail, index) => (
                  <div className="mb-7" key={"detail-" + index}>
                    <h4 className="text-base lg:text-[25px]">
                      {detail.name}
                    </h4>
                    <p className="mt-2">{detail.content}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="website mt-10 lg:mt-0 lg:col-6">
            <div className="rounded border border-border p-6 dark:border-darkmode-border ">
              {markdownify(website.title, "h2", "section-title mb-12")}
              <ul className="row">
                {website?.list?.map((item, index) => (
                  <li
                    className="mb-5 text-lg font-bold text-dark dark:text-darkmode-light"
                    key={"website-" + index}
                  >
                    <a href="https://my-website-for-portfolio.netlify.app/">
                    {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
