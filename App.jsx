import React, { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  CalendarDays,
  Clock3,
  Heart,
  MapPin,
  Music4,
  Phone,
  PartyPopper,
  Church,
  UtensilsCrossed,
} from "lucide-react";

const weddingData = {
  couple: "Helena & Ante",
  heroImage: "/helena-ante.jpeg",
  introVideo: "/pressed-love-envelope-52d49bf5.mp4",
  musicFile: "/wedding-song.mp3",
  weddingDate: "2026-09-04T17:30:00",
  message:
    "Pozivamo vas da budete dio našeg posebnog dana i da s nama podijelite ljubav, radost i najljepše uspomene.",
  gathering: {
    title: "Okupljanje",
    time: "14:30",
    location: "Ledana Caffe Bar",
    address: "Trg Kralja Tomislava 2, Velika Gorica",
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=Ledana+Caffe+Bar+Trg+Kralja+Tomislava+2+Velika+Gorica",
  },
  church: {
    title: "Crkveno vjenčanje",
    time: "17:30",
    location: "Crkva Svete Barbare",
    address: "Školska ulica 33, Velika Mlaka",
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=Crkva+Svete+Barbare+Skolska+ulica+33+Velika+Mlaka",
  },
  venue: {
    title: "Svečana večera",
    time: "20:00",
    location: "Restoran Gastro Globus",
    address: "Avenija Dubrovnik 15, Zagreb",
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=Restoran+Gastro+Globus+Avenija+Dubrovnik+15+Zagreb",
  },
  rsvpDeadlineLabel: "Molimo da svoj dolazak potvrdite do 14. kolovoza 2026.",
  contacts: [
    { name: "Helena", phone: "+385 99 777 1593" },
    { name: "Ante", phone: "+385 99 689 2189" },
  ],
};

function useCountdown(targetDate) {
  const target = useMemo(() => new Date(targetDate).getTime(), [targetDate]);
  const [timeLeft, setTimeLeft] = useState(target - Date.now());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(target - Date.now());
    }, 1000);

    return () => clearInterval(timer);
  }, [target]);

  const safe = Math.max(timeLeft, 0);

  return {
    days: Math.floor(safe / (1000 * 60 * 60 * 24)),
    hours: Math.floor((safe / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((safe / (1000 * 60)) % 60),
    seconds: Math.floor((safe / 1000) % 60),
  };
}

function CountdownCard({ label, value }) {
  return (
    <div className="countdown-card">
      <div className="countdown-value">
        {String(value).padStart(2, "0")}
      </div>
      <div className="countdown-label">{label}</div>
    </div>
  );
}

function DetailCard({ icon, title, time, location, address, mapsUrl }) {
  return (
    <div className="detail-card">
      <div className="detail-header">
        <div className="detail-icon">{icon}</div>
        <h3>{title}</h3>
      </div>

      <div className="detail-content">
        <div className="detail-row">
          <Clock3 size={16} />
          <span>{time}</span>
        </div>

        <div className="detail-row">
          <MapPin size={16} />
          <span>{location}</span>
        </div>

        <p className="detail-address">{address}</p>
      </div>

      <a
        href={mapsUrl}
        target="_blank"
        rel="noreferrer"
        className="primary-small-button"
      >
        <MapPin size={16} />
        Otvori lokaciju
      </a>
    </div>
  );
}

export default function App() {
  const [opened, setOpened] = useState(false);
  const [showIntroVideo, setShowIntroVideo] = useState(false);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [audioReady, setAudioReady] = useState(false);

  const audioRef = useRef(null);
  const videoRef = useRef(null);

  const countdown = useCountdown(weddingData.weddingDate);

  const formattedDate = new Date(weddingData.weddingDate).toLocaleDateString(
    "hr-HR",
    {
      day: "numeric",
      month: "long",
      year: "numeric",
    }
  );

  const playMusic = async () => {
    if (!audioRef.current) return;

    try {
      audioRef.current.volume = 0.35;
      await audioRef.current.play();
      setAudioPlaying(true);
      setAudioReady(true);
    } catch {
      setAudioReady(true);
      setAudioPlaying(false);
    }
  };

  const openInvitation = async () => {
    setShowIntroVideo(true);
    await playMusic();

    requestAnimationFrame(async () => {
      if (!videoRef.current) return;

      try {
        videoRef.current.currentTime = 0;
        await videoRef.current.play();
      } catch {
        setOpened(true);
      }
    });
  };

  const toggleAudio = async () => {
    if (!audioRef.current) return;

    if (audioPlaying) {
      audioRef.current.pause();
      setAudioPlaying(false);
      return;
    }

    try {
      await audioRef.current.play();
      setAudioPlaying(true);
    } catch {
      setAudioPlaying(false);
    }
  };

  const finishIntro = () => {
    setOpened(true);
    setShowIntroVideo(false);
  };

  return (
    <div className="app-shell">
      <audio ref={audioRef} loop preload="auto">
        <source src={weddingData.musicFile} type="audio/mpeg" />
      </audio>

      <AnimatePresence mode="wait">
        {!opened && !showIntroVideo ? (
          <motion.section
            key="cover"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="cover-screen"
          >
            <div className="cover-card">
              <div className="cover-inner">
                <p className="cover-eyebrow">Wedding Invitation</p>

                <h1 className="cover-title">{weddingData.couple}</h1>

                <div className="cover-divider">
                  <span />
                  <Heart size={14} fill="currentColor" />
                  <span />
                </div>

                <p className="cover-invite">Pozivamo vas</p>
                <p className="cover-subtitle">na naše vjenčanje</p>
                <p className="cover-date">04. RUJNA 2026.</p>

                <div className="cover-note">
                  <p className="cover-note-title">Dodirnite za otvaranje</p>
                  <p className="cover-note-text">
                    Nakon dodira kreće uvodni video i glazba.
                  </p>
                </div>
              </div>

              <button onClick={openInvitation} className="primary-button">
                Otvori pozivnicu
              </button>
            </div>
          </motion.section>
        ) : null}

        {!opened && showIntroVideo ? (
          <motion.section
            key="intro-video"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="intro-video-screen"
          >
            <video
              ref={videoRef}
              className="intro-video"
              playsInline
              preload="auto"
              onEnded={finishIntro}
            >
              <source src={weddingData.introVideo} type="video/mp4" />
            </video>

            <button onClick={finishIntro} className="skip-button">
              Preskoči
            </button>
          </motion.section>
        ) : null}

        {opened ? (
          <motion.main
            key="main-content"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <section className="hero-section">
              <img
                src={weddingData.heroImage}
                alt="Helena i Ante"
                className="hero-image"
              />
              <div className="hero-overlay" />

              <div className="hero-content">
                <p className="hero-eyebrow">Pozivnica za vjenčanje</p>
                <h1 className="hero-title">{weddingData.couple}</h1>

                <div className="hero-date-row">
                  <CalendarDays size={18} />
                  <span>{formattedDate}</span>
                </div>

                <p className="hero-message">{weddingData.message}</p>

                <button onClick={toggleAudio} className="glass-button">
                  <Music4 size={16} />
                  <span>
                    {audioPlaying ? "Pauziraj glazbu" : "Pokreni glazbu"}
                  </span>
                </button>

                {audioReady && !audioPlaying ? (
                  <p className="hero-audio-note">
                    Glazba je spremna. Dodirnite gumb za reprodukciju.
                  </p>
                ) : null}
              </div>
            </section>

            <section className="container overlap-section">
              <div className="panel">
                <div className="countdown-layout">
                  <div>
                    <p className="section-eyebrow">Odbrojavanje</p>
                    <h2 className="section-title">
                      Brojimo dane do našeg vjenčanja
                    </h2>
                    <p className="section-text">
                      Veselimo se što ćete biti dio našeg dana.
                    </p>

                    <div className="countdown-grid">
                      <CountdownCard label="Dana" value={countdown.days} />
                      <CountdownCard label="Sati" value={countdown.hours} />
                      <CountdownCard label="Min" value={countdown.minutes} />
                      <CountdownCard label="Sek" value={countdown.seconds} />
                    </div>
                  </div>

                  <div className="note-card">
                    <p className="section-eyebrow">Potvrda dolaska</p>
                    <h3 className="note-title">Važna napomena</h3>
                    <p className="section-text">
                      {weddingData.rsvpDeadlineLabel}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="container section-space">
              <div className="details-grid">
                <DetailCard
                  icon={<PartyPopper size={20} />}
                  title={weddingData.gathering.title}
                  time={weddingData.gathering.time}
                  location={weddingData.gathering.location}
                  address={weddingData.gathering.address}
                  mapsUrl={weddingData.gathering.mapsUrl}
                />

                <DetailCard
                  icon={<Church size={20} />}
                  title={weddingData.church.title}
                  time={weddingData.church.time}
                  location={weddingData.church.location}
                  address={weddingData.church.address}
                  mapsUrl={weddingData.church.mapsUrl}
                />

                <DetailCard
                  icon={<UtensilsCrossed size={20} />}
                  title={weddingData.venue.title}
                  time={weddingData.venue.time}
                  location={weddingData.venue.location}
                  address={weddingData.venue.address}
                  mapsUrl={weddingData.venue.mapsUrl}
                />
              </div>
            </section>

            <section className="container section-space section-bottom">
              <div className="panel">
                <p className="section-eyebrow">Kontakt</p>
                <h2 className="section-title">Potvrdite svoj dolazak</h2>
                <p className="section-text">
                  Za potvrdu dolaska javite se Heleni ili Anti.
                </p>

                <div className="contact-grid">
                  {weddingData.contacts.map((contact) => (
                    <a
                      key={contact.phone}
                      href={`tel:${contact.phone.replace(/\s+/g, "")}`}
                      className="contact-card"
                    >
                      <div className="contact-icon">
                        <Phone size={18} />
                      </div>

                      <div>
                        <p className="contact-name">{contact.name}</p>
                        <p className="contact-phone">{contact.phone}</p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </section>
          </motion.main>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
