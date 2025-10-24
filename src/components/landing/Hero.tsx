import { SignUpButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button"
import { CalendarIcon, MicIcon, StarIcon } from "lucide-react";
import Image from "next/image";

function Hero() {
  return (
    <section className="relative h-screen overflow-hidden bg-[var(--background)] transition-colors duration-500 pt-20">
      {/* Grid Background */}
      <div
        className="absolute inset-0 
        bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)]
        bg-[size:4rem_4rem] 
        mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,black_70%,transparent_110%)]
        opacity-80 dark:opacity-25"
      />

      {/* GRADIENT ORBS */}
      <div className="absolute top-20 left-1/4 w-72 h-72 bg-gradient-to-r from-primary/20
      to-primary/10 rounded-full blur-3xl" />
      <div className="absolute top-13 right-1/4 w-46 h-46 bg-gradient-to-r from-primary/15
      to-primary/5 rounded-full blur-2xl" />
      <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-gradient-to-r from-primary/15
      to-primary/5 rounded-full blur-3xl" />

      <div className="relative z-10 w-full px-6 pt-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* LEFT CONTENT */}
            <div className="space-y-10">
              <div className="space-y-6">
                {/* BADGE */}
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r
                from-primary/10 to-primary/5 rounded-full border border-primary/20 backdrop-blur-sm">
                  <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-primary whitespace-nowrap animate-pulse">
                    AI-Powered Crop Prediction Platform
                  </span>
                </div>

                {/* MAIN HEADING */}
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight">
                  <span className="bg-gradient-to-br from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent">
                    Your Agricultural
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                    questions
                  </span>
                  <br />
                  <span className="bg-gradient-to-br from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent">
                    answered instantly
                  </span>
                </h1>

                {/* SUBTITLE */}
                <p className="text-lg text-muted-foreground leading-relaxed max-w-xl font-medium">
                  Predict your crop yields, solve farming challenges, and optimize your harvest with AI-powered insights. 
                  Get guidance anytime, anywhere.
                </p>
              </div>

              {/* CTA BUTTONS */}
              <div className="flex flex-col sm:flex-row gap-4">
                <SignUpButton mode="modal">
                  <Button size={"lg"}>
                    <MicIcon className="mr-2 size-5" />
                    Try voice agent
                  </Button>
                </SignUpButton>

                <SignUpButton mode="modal">
                  <Button size={"lg"} variant={"outline"}>
                    <CalendarIcon className="mr-2 size-5" />
                    Analyze your fields
                  </Button>
                </SignUpButton>

              </div>

              {/* USER TESTIMONIALS */}
              <div className="pt-8">
                <div className="flex items-center gap-6">
                  {/* USER AVATARS */}
                  <div className="flex -space-x-3">
                    <Image 
                      src={"/alex-suprun-ZHvM3XIOHoE-unsplash.jpg"}
                      alt="John Adam"
                      width={48}
                      height={48}
                      className="w-12 h-12 rounded-full object-cover ring-4 ring-background"
                    />
                    <Image 
                      src={"/alex-suprun-mynsNaNwVDc-unsplash.jpg"}
                      alt="Alexa Bliss"
                      width={48}
                      height={48}
                      className="w-12 h-12 rounded-full object-cover ring-4 ring-background"
                    />
                    <Image 
                      src={"/christian-buehner-DItYlc26zVI-unsplash.jpg"}
                      alt="Christian Buehner"
                      width={48}
                      height={48}
                      className="w-12 h-12 rounded-full object-cover ring-4 ring-background"
                    />
                    <Image 
                      src={"/jake-nackos-IF9TK5Uy-KI-unsplash.jpg"}
                      alt="Jake Nackos"
                      width={48}
                      height={48}
                      className="w-12 h-12 rounded-full object-cover ring-4 ring-background"
                    />
                    <Image 
                      src={"/muradi-y3IpNXZAuGo-unsplash.jpg"}
                      alt="Alex William"
                      width={48}
                      height={48}
                      className="w-12 h-12 rounded-full object-cover ring-4 ring-background"
                    />
                  </div>

                  {/* RATING & STATS */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        {[1,2,3,4,5].map((star) => (
                          <StarIcon key={star} className="h-4 w-4 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      <span className="text-sm font-bold text-foreground">4.9/5</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Trusted by{" "}
                      <span className="font-semibold text-foreground">1,200+ farmers</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT CONTENT - HERO IMAGE */}
            <div className="relative lg:pl-8">
              {/* GRADIENT ORBS */}
              <div className="absolute -top-6 right-1/4 w-18 h-18 bg-gradient-to-r from-primary/15
              to-primary/5 rounded-full blur-2xl" />
              <div className="absolute -bottom-12 right-1/4 w-32 h-32 bg-gradient-to-r from-primary/15
              to-primary/5 rounded-full blur-2xl" />

              <Image
               src={"/HERO-KS.png"}
               alt="krishiSaathi AI"
               width={600}
               height={600}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;