import "../assets/Footer.css"

const Footer = () => {
    return(
        <footer className="fs-6 py-3 d-flex justify-content-center align-items-center">
            <span className="text-danger">●</span>
            <a className="mx-3" href="https://portfolio-thalesondas.netlify.app/" target="_blank" rel="noopener noreferrer">
                <span> Desenvolvido por Thales Ondas </span>
            </a>
            <span className="text-danger">●</span>
        </footer>
    )
}

export default Footer;