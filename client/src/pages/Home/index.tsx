
import { Box } from "@mui/material";
import { Hero } from "./components/Hero";
import { Features } from "./components/Features";
import { Testimonials } from "./components/Testimonials";
import { CTA } from "./components/CTA";

export default function Home() {
  return (
    <Box>
      <Hero />
      <Features />
      <Testimonials />
      <CTA />
    </Box>
  );
}
