import Head from "next/head";
import Footer from "./footer";
import Navbar from "./navbar";

export default function Layout({ children, title, keywords }) {
    return (
        <>
            <div className="wrapper">
                <Head>
                    <meta keywords={keywords}></meta>
                    <title>{title}</title>
                </Head>
                <Navbar />
                {children}
                <Footer />
            </div>
        </>
    );
};