"use client";

import type { CSSProperties, FormEvent } from "react";
import { useState } from "react";
import { Icon } from "@/components/ui/icons";

type FormState = "idle" | "submitting" | "success" | "error";

export function ContactForm() {
  const [state, setState] = useState<FormState>("idle");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [reason, setReason] = useState("feedback");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    setState("submitting");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message, reason }),
      });
      if (res.ok) {
        setState("success");
        setName("");
        setEmail("");
        setMessage("");
        setReason("feedback");
      } else {
        setState("error");
      }
    } catch {
      setState("error");
    }
  };

  if (state === "success") {
    return (
      <div
        style={{
          background: "var(--green-bg)",
          border: "1.5px solid var(--green-border)",
          borderRadius: "var(--radius-lg)",
          padding: "32px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            width: "48px",
            height: "48px",
            background: "var(--green)",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 16px",
          }}
        >
          <Icon.Check style={{ width: "24px", height: "24px", color: "#fff" }} />
        </div>
        <h3 style={{ fontSize: "18px", fontWeight: 800, color: "var(--black)", margin: "0 0 8px" }}>
          Message sent!
        </h3>
        <p style={{ fontSize: "14px", color: "var(--gray-500)", margin: 0 }}>
          We&apos;ll get back to you as soon as we can.
        </p>
      </div>
    );
  }

  const inputStyle: CSSProperties = {
    width: "100%",
    height: "48px",
    border: "1.5px solid var(--border-strong)",
    borderRadius: "12px",
    padding: "0 16px",
    fontSize: "15px",
    fontFamily: "inherit",
    color: "var(--black)",
    background: "var(--white)",
    outline: "none",
    transition: "border-color 0.15s",
    boxSizing: "border-box",
  };

  const labelStyle: CSSProperties = {
    display: "block",
    fontSize: "13px",
    fontWeight: 600,
    color: "var(--gray-700)",
    marginBottom: "6px",
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div>
        <label style={labelStyle}>What&apos;s this about?</label>
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {[
            { value: "feedback", label: "Feedback" },
            { value: "bug", label: "Bug report" },
            { value: "classroom", label: "Classroom use" },
            { value: "other", label: "Other" },
          ].map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setReason(opt.value)}
              style={{
                padding: "7px 16px",
                borderRadius: "var(--radius-pill)",
                border: "1.5px solid",
                borderColor: reason === opt.value ? "var(--green)" : "var(--border-strong)",
                background: reason === opt.value ? "var(--green-bg)" : "var(--white)",
                color: reason === opt.value ? "var(--green-deeper)" : "var(--gray-700)",
                fontSize: "13px",
                fontWeight: 700,
                fontFamily: "inherit",
                cursor: "pointer",
                transition: "all 0.15s",
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
        <div>
          <label style={labelStyle} htmlFor="contact-name">
            Name
          </label>
          <input
            id="contact-name"
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={inputStyle}
          />
        </div>
        <div>
          <label style={labelStyle} htmlFor="contact-email">
            Email
          </label>
          <input
            id="contact-email"
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={inputStyle}
          />
        </div>
      </div>

      <div>
        <label style={labelStyle} htmlFor="contact-message">
          Message
        </label>
        <textarea
          id="contact-message"
          placeholder="Tell us what's on your mind..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          rows={5}
          style={{
            ...inputStyle,
            height: "auto",
            padding: "14px 16px",
            resize: "vertical",
            lineHeight: 1.6,
          }}
        />
      </div>

      {state === "error" && (
        <p style={{ fontSize: "13px", color: "#ef4444", margin: 0 }}>
          Something went wrong. Please try again or email us directly.
        </p>
      )}

      <button
        type="submit"
        disabled={state === "submitting"}
        className="btn-green"
        style={{ width: "100%", height: "48px", opacity: state === "submitting" ? 0.7 : 1 }}
      >
        {state === "submitting" ? "Sending..." : "Send message"}
      </button>
    </form>
  );
}
