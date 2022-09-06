type Sampler =
  | "ddim"
  | "k_dpm_2_a"
  | "k_dpm_2"
  | "k_euler_a"
  | "k_euler"
  | "k_heun"
  | "k_lms"
  | "plms";

export type PromptConfig = {
  prompt: string;
  iterations: number;
  steps: number;
  cfgscale: number;
  sampler: Sampler;
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
