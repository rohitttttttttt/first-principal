import { FiVideo, FiSearch, FiStar, FiList, FiTv, FiShield, FiLinkedin, FiGithub, FiMail, FiMessageCircle } from 'react-icons/fi'

export default function AboutPage() {
    return (
        <div className="about-page">
            <div className="about-header">
                <img src="/logo.png" alt="First Principal" className="about-logo-img" />
                <h1>First Principal</h1>
                <p>A distraction-free YouTube learning platform</p>
            </div>

            <div className="about-content">
                <div className="about-section">
                    <h2>What is First Principal?</h2>
                    <p>
                        First Principal is a focused YouTube experience built for learners who believe in understanding
                        things from the ground up. Search, watch, and organize YouTube content without the distractions
                        — no recommended feed, no shorts, no endless scrolling. Just focused learning from first principles.
                    </p>
                </div>

                <div className="about-section">
                    <h2>Features</h2>
                    <div className="about-features">
                        <div className="about-feature">
                            <div className="about-feature-icon"><FiSearch size={16} /></div>
                            <div>
                                <h3>Search</h3>
                                <p>Find videos, playlists, and channels with type-specific filters.</p>
                            </div>
                        </div>
                        <div className="about-feature">
                            <div className="about-feature-icon"><FiVideo size={16} /></div>
                            <div>
                                <h3>Watch</h3>
                                <p>Clean embedded player with full video details.</p>
                            </div>
                        </div>
                        <div className="about-feature">
                            <div className="about-feature-icon"><FiList size={16} /></div>
                            <div>
                                <h3>Playlists</h3>
                                <p>Navigate between playlist videos while watching.</p>
                            </div>
                        </div>
                        <div className="about-feature">
                            <div className="about-feature-icon"><FiTv size={16} /></div>
                            <div>
                                <h3>Channels</h3>
                                <p>Explore channel pages with videos and playlists.</p>
                            </div>
                        </div>
                        <div className="about-feature">
                            <div className="about-feature-icon"><FiStar size={16} /></div>
                            <div>
                                <h3>Save</h3>
                                <p>Bookmark content for quick access later.</p>
                            </div>
                        </div>
                        <div className="about-feature">
                            <div className="about-feature-icon"><FiShield size={16} /></div>
                            <div>
                                <h3>Privacy</h3>
                                <p>No tracking. Data stays in your browser only.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="about-section">
                    <h2>Built With</h2>
                    <div className="about-tech-stack">
                        <span className="about-tech">React</span>
                        <span className="about-tech">Vite</span>
                        <span className="about-tech">YouTube Data API v3</span>
                        <span className="about-tech">React Router</span>
                        <span className="about-tech">React Icons</span>
                    </div>
                </div>

                <div className="about-section">
                    <h2><FiMessageCircle size={16} style={{ verticalAlign: 'middle', marginRight: 4 }} /> Suggest Features & Improvements</h2>
                    <div className="about-contact">
                        <p>
                            Have an idea to make First Principal better? Found a bug? I'd love to hear from you!
                            Reach out to suggest features, report issues, or just say hello.
                        </p>
                        <div className="about-links">
                            <a href="https://www.linkedin.com/in/rohit-mishra-9678292a6/" target="_blank" rel="noopener noreferrer" className="about-link about-link--linkedin">
                                <FiLinkedin size={15} /> Connect on LinkedIn
                            </a>
                            <a href="https://github.com/rohitttttttttt/" target="_blank" rel="noopener noreferrer" className="about-link about-link--github">
                                <FiGithub size={15} /> View on GitHub
                            </a>
                            <a href="mailto:speedcuts29@gmail.com" className="about-link about-link--email">
                                <FiMail size={15} /> speedcuts29@gmail.com
                            </a>
                        </div>
                    </div>
                </div>

                <div className="about-section">
                    <h2>Legal</h2>
                    <p>
                        First Principal uses the official YouTube Data API v3 and YouTube IFrame Player API.
                        All video content is owned by the respective creators and streamed directly from YouTube.
                        This application does not download, store, or redistribute any YouTube content.
                    </p>
                </div>
            </div>
        </div>
    )
}
