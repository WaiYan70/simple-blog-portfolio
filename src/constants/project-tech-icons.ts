import {
  siAxios,
  siCloudinary,
  siExpress,
  siGoogleauthenticator,
  siHostinger,
  siJest,
  siJsonwebtokens,
  siMongodb,
  siNodedotjs,
  siPuppeteer,
  siReact,
  siRedis,
  siTailwindcss,
  siTypescript,
  siVercel,
  siVite,
} from "simple-icons/icons";

export const projectTechIcons = {
  siAxios,
  siCloudinary,
  siExpress,
  siGoogleauthenticator,
  siHostinger,
  siJest,
  siJsonwebtokens,
  siMongodb,
  siNodedotjs,
  siPuppeteer,
  siReact,
  siRedis,
  siTailwindcss,
  siTypescript,
  siVercel,
  siVite,
} as const;

export type ProjectTechIconKey = keyof typeof projectTechIcons;

export const isProjectTechIconKey = (
  value: string,
): value is ProjectTechIconKey => {
  return value in projectTechIcons;
};
