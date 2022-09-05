export type PromptConfig = {
  prompt: string;
  iterations: number;
  steps: number;
  cfgscale: number;
  sampler: "k_lms" | "ddim";
  width: number;
  height: number;
  seed: number;
  initimg: null;
  strength: number;
  fit: "on";
  gfpgan_strength: number;
  upscale_level: "";
  upscale_strength: number;
  progress_images?: "off" | "on";
};

export type PromptOptions = Partial<PromptConfig> & {
  prompt: string;
};
