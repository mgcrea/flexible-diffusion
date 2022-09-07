type Sampler = "ddim" | "k_dpm_2_a" | "k_dpm_2" | "k_euler_a" | "k_euler" | "k_heun" | "k_lms" | "plms";

export type PromptConfig = {
  cfgscale: number;
  fit: "on";
  gfpgan_strength: number;
  height: number;
  initimg_name: string;
  initimg: null;
  iterations: number;
  progress_images?: "off" | "on";
  prompt: string;
  sampler: Sampler;
  seed: number;
  steps: number;
  strength: number;
  upscale_level: "";
  upscale_strength: number;
  variation_amount: number;
  width: number;
  with_variations: string;
};

export type PromptOptions = Partial<PromptConfig> & {
  prompt: string;
};
