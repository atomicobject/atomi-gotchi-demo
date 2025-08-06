// TODO: Change this to be the main branch before merging
const GIF_FOLDER =
  "https://raw.githubusercontent.com/atomicobject/atomi-gotchi-demo/main/public/gifs";

export const enum EmailTemplates {
  PET_CREATED,
  HUNGRY,
}

const getStatColor = (stat: number) => {
  if (stat <= 30) return "#f44336";
  else if (stat <= 60) return "#ff9800";
  return "#4caf50";
};

const getStatBar = (label: string, stat: number) => {
  const color = getStatColor(stat);

  return `
    <div style="display: flex; align-items: center; margin: 15px 0; max-width: 300px;">
      <span style="margin-right: 10px; font-weight: bold; font-size: 14px;">${label}</span>
      <div style="width: 150px; background: #e0e0e0; border-radius: 8px; overflow: hidden; height: 20px;">
        <div style="width: ${Math.max(0, Math.min(100, stat))}%; height: 100%; background: ${color}; border-radius: 8px;"></div>
      </div>
      <span style="margin-left: 8px; font-size: 14px;">${stat}%</span>
    </div>
  `;
};

const URL = "http://localhost:5173"; //"https://atomigotchi.atomicobject.com";

export const getEmailTemplate = (
  template: EmailTemplates,
  pet: { _id?: string; name: string; health: number; hunger: number; mood: string }
) => {
  let emailContent = "";

  switch (template) {
    case EmailTemplates.PET_CREATED:
      emailContent += `
      <h1>🎉 Welcome to Atomi-Gotchi! 🎉</h1>
      <p>${pet.name} is super excited to meet you ❤️</p>
      <p>Throughout the day, you'll get email notifications when ${pet.name} is hungry or wants to play.</p>
      <p>In each email, you'll find a link to play a mini-game to help keep your pet happy and healthy.</p>
    `;
      break;

    case EmailTemplates.HUNGRY:
      emailContent += `<p>${pet.name} is feeling hungry!</p>
    <p>Click <a href="${URL}/cooking">here</a> to feed your pet!</p>
    `;
      break;
  }

  emailContent += `
    <img src="${GIF_FOLDER}/${pet.mood}.gif" alt="Virtual Pet" width="100" height="100">
    <br> 
    ${getStatBar("❤️", pet.health)}
    ${getStatBar("🍪", pet.hunger)}
  `;

  return emailContent;
};
