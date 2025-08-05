// TODO: Change this to be the main branch before merging
const GIF_FOLDER =
  "https://raw.githubusercontent.com/bo-french/atomi-gotchi/main/public/gifs";

export const emailTemplates = {
    default: `
    <h1>🐾 Your Virtual Pet Says Hello!</h1>
    <p>Welcome to the Virtual Pet Email Game!</p>
    <img src="${GIF_FOLDER}/happy.gif" alt="Virtual Pet" width="200" height="200">
    <br> `, 

  hungry: {
    html: (opts: {
      petName: string;
      hungerPercent: number;
      hungerColor: string;
      petGifUrl: string;
      appLink: string;
    }) => `
      <!DOCTYPE html>
      <html lang="en">
      <head><meta charset="utf-8" /></head>
      <body style="font-family: system-ui,-apple-system,BlinkMacSystemFont,sans-serif; background:#f0f9ff; padding:20px; text-align:center;">
        <div style="max-width:600px;margin:auto;background:#fff;border-radius:16px; padding:32px; box-shadow:0 10px 30px rgba(31,61,120,0.08);">
          <div style="font-size:48px;">🍽️🐾</div>
          <h1 style="margin:8px 0;">${opts.petName} is feeling hungry!</h1>
          <p style="font-size:16px; line-height:1.4;">
            Oh no! <strong>${opts.petName}</strong>'s tummy is rumbling. Feed them now to keep their health up and mood bright.
          </p>
          <div style="margin:16px auto; width:80%; background:#e6f2ff; border-radius:12px; padding:6px;">
            <div style="font-weight:600; margin-bottom:4px;">Hunger Level</div>
            <div style="position:relative; background:#e0e0e0; border-radius:8px; overflow:hidden; height:14px;">
              <div style="
                width:${Math.max(0, Math.min(100, opts.hungerPercent))}%;
                height:100%;
                background:${opts.hungerColor};
                transition:width .3s ease;
                border-radius:8px;
              "></div>
            </div>
            <div style="margin-top:4px;">${opts.hungerPercent}%</div>
          </div>
          <img src="${opts.petGifUrl}" alt="Hungry pet" width="200" style="border-radius:12px; box-shadow:0 8px 20px rgba(31,61,120,0.1);" />
          <p style="font-size:16px; line-height:1.4;">
            Every bite helps—don’t let them go hungry for too long.
          </p>
          <a href="${opts.appLink}" style="
            display:inline-block;
            padding:14px 28px;
            background:#1976d2;
            color:#fff;
            border-radius:999px;
            font-weight:600;
            text-decoration:none;
            box-shadow:0 6px 16px rgba(25,118,210,0.3);
          ">
            Feed Your Pet 🍎
          </a>
          <p style="font-size:12px; color:#6b7a99; margin-top:24px;">
            Tip: Try different treats to discover their favorites!
          </p>
        </div>
      </body>
      </html>
    `,
    text: (opts: { petName: string; appLink: string }) => `
Subject: ${opts.petName} is hungry! 🍪🐾

Hey there!

Your pet ${opts.petName} is feeling hungry. Feed them now to keep their health up and their mood bright.

Feed your pet: ${opts.appLink}

Tip: Try different treats to see what they love!
    `,
  },

  higherLower: {
    html: (opts: {
      petName: string;
      score: number;
      highScore: number;
      triesLeft: number;
      lastOutcome: string;
      appLink: string;
    }) => `
      <!DOCTYPE html>
      <html lang="en">
      <head><meta charset="utf-8" /></head>
      <body style="font-family: system-ui,-apple-system,BlinkMacSystemFont,sans-serif; background:#f4f9fc; padding:20px; text-align:center;">
        <div style="max-width:600px;margin:auto;background:#fff;border-radius:16px; padding:32px; box-shadow:0 12px 36px rgba(25, 118, 210, 0.08);">
          <div style="font-size:42px;">🎲🐾</div>
          <h1 style="margin:8px 0;">Time for Higher or Lower!</h1>
          <p style="font-size:16px; line-height:1.4;">
            Hey! <strong>${opts.petName}</strong> wants to play. You just had: <strong>${opts.lastOutcome}</strong>
          </p>
          <p style="margin:8px 0;">
            <strong>Score:</strong> ${opts.score} &nbsp;|&nbsp; <strong>High Score:</strong> ${opts.highScore}
          </p>
          <p style="margin:4px 0;">
            <strong>Tries left:</strong> ${opts.triesLeft}
          </p>
          <img src="${GIF_FOLDER}/thinking.gif" alt="Pet thinking" width="180" style="border-radius:12px; margin:12px 0;" />
          <p style="font-size:15px;">
            Guess whether the next number is higher or lower and keep your pet happy! Every correct guess gives +5 health, wrong ones take -5.
          </p>
          <a href="${opts.appLink}" style="
            display:inline-block;
            padding:14px 28px;
            background:#0d47a1;
            color:#fff;
            border-radius:999px;
            font-weight:600;
            text-decoration:none;
            margin-top:8px;
            box-shadow:0 6px 16px rgba(13,71,161,0.35);
          ">
            Play Higher or Lower ▶
          </a>
          <p style="font-size:12px; color:#6b7a99; margin-top:24px;">
            Keep an eye on health—if your pet’s health drops too low, the game will end. Don’t let them get too sad!
          </p>
        </div>
      </body>
      </html>
    `,
    text: (opts: {
      petName: string;
      score: number;
      highScore: number;
      triesLeft: number;
      lastOutcome: string;
      appLink: string;
    }) => `
Subject: Play Higher or Lower with ${opts.petName}! 🎲🐾

${opts.petName} just had: ${opts.lastOutcome}
Score: ${opts.score} | High Score: ${opts.highScore}
Tries left: ${opts.triesLeft}

Guess higher or lower to keep your pet happy. Every correct guess gives +5 health, wrong ones take -5.

Play now: ${opts.appLink}
    `,
  },

  rockPaperScissors: {
    html: (opts: {
      petName: string;
      round: number;
      won: number;
      lost: number;
      outcomeSummary: string;
      appLink: string;
    }) => `
      <!DOCTYPE html>
      <html lang="en">
      <head><meta charset="utf-8" /></head>
      <body style="font-family: system-ui,-apple-system,BlinkMacSystemFont,sans-serif; background:#fff8f2; padding:20px; text-align:center;">
        <div style="max-width:600px;margin:auto;background:#fff;border-radius:16px; padding:32px; box-shadow:0 14px 40px rgba(255, 152, 0, 0.08);">
          <div style="font-size:42px;">✂️🪨📄🐾</div>
          <h1 style="margin:8px 0;">Rock Paper Scissors Time!</h1>
          <p style="font-size:16px;">
            <strong>${opts.petName}</strong> just finished round ${opts.round}. ${opts.outcomeSummary}
          </p>
          <p style="margin:4px 0;">
            <strong>Won:</strong> ${opts.won} &nbsp;|&nbsp; <strong>Lost:</strong> ${opts.lost}
          </p>
          <img src="${GIF_FOLDER}/playful.gif" alt="Pet playing" width="180" style="border-radius:12px; margin:12px 0;" />
          <p style="font-size:15px;">
            Keep playing to cheer up your pet—wins give +5 health, losses take -5. Best of three decides the champion!
          </p>
          <a href="${opts.appLink}" style="
            display:inline-block;
            padding:14px 28px;
            background:#ff8f00;
            color:#fff;
            border-radius:999px;
            font-weight:600;
            text-decoration:none;
            margin-top:8px;
            box-shadow:0 6px 16px rgba(255,143,0,0.35);
          ">
            Play Rock Paper Scissors ▶
          </a>
          <p style="font-size:12px; color:#6b7a99; margin-top:24px;">
            Tip: Ties are neutral—focus on getting two wins before your pet gets too tired!
          </p>
        </div>
      </body>
      </html>
    `,
    text: (opts: {
      petName: string;
      round: number;
      won: number;
      lost: number;
      outcomeSummary: string;
      appLink: string;
    }) => `
Subject: ${opts.petName} just played Rock Paper Scissors! ✂️🪨📄🐾

Round: ${opts.round}
${opts.outcomeSummary}
Won: ${opts.won} | Lost: ${opts.lost}

Keep playing to boost their mood and health!

Play now: ${opts.appLink}
    `,
  },

  simonSays: {
    html: (opts: {
      petName: string;
      correctStreak: number;
      lastSequenceResult: string;
      nextDifficultyHint?: string;
      appLink: string;
    }) => `
      <!DOCTYPE html>
      <html lang="en">
      <head><meta charset="utf-8" /></head>
      <body style="font-family: system-ui,-apple-system,BlinkMacSystemFont,sans-serif; background:#eef7fb; padding:20px; text-align:center;">
        <div style="max-width:600px;margin:auto;background:#fff;border-radius:16px; padding:32px; box-shadow:0 12px 36px rgba(25, 118, 210, 0.08);">
          <div style="font-size:48px;">🎯🐾</div>
          <h1 style="margin:8px 0;">Simon Says Time!</h1>
          <p style="font-size:16px; line-height:1.4;">
            <strong>${opts.petName}</strong> just finished a round. ${opts.lastSequenceResult}
          </p>
          <p style="margin:4px 0;">
            <strong>Current streak:</strong> ${opts.correctStreak}
          </p>
          ${
            opts.nextDifficultyHint
              ? `<p style="font-size:14px; color:#555;">Hint: ${opts.nextDifficultyHint}</p>`
              : ""
          }
          <img src="${GIF_FOLDER}/simon.gif" alt="Simon Says" width="180" style="border-radius:12px; margin:12px 0;" />
          <p style="font-size:15px;">
            Keep your focus sharp—each correct sequence keeps your pet happy and healthy.
          </p>
          <a href="${opts.appLink}" style="
            display:inline-block;
            padding:14px 28px;
            background:#00695c;
            color:#fff;
            border-radius:999px;
            font-weight:600;
            text-decoration:none;
            margin-top:8px;
            box-shadow:0 6px 16px rgba(0,105,92,0.35);
          ">
            Play Simon Says ▶
          </a>
          <p style="font-size:12px; color:#6b7a99; margin-top:24px;">
            Tip: Watch closely—practice builds memory and keeps ${opts.petName} excited!
          </p>
        </div>
      </body>
      </html>
    `,
    text: (opts: {
      petName: string;
      correctStreak: number;
      lastSequenceResult: string;
      nextDifficultyHint?: string;
      appLink: string;
    }) => `
Subject: ${opts.petName} wants to play Simon Says! 🎯🐾

${opts.lastSequenceResult}
Current streak: ${opts.correctStreak}
${opts.nextDifficultyHint ? `Hint: ${opts.nextDifficultyHint}` : ""}

Play now: ${opts.appLink}

Tip: Watch closely—practice builds memory and keeps ${opts.petName} excited! 
    `,
  },
};
