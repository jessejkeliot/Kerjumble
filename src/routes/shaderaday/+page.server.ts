import { redirect } from "@sveltejs/kit";

export function load(){
  const today = new Date().toISOString().split('T')[0];
  throw redirect(307, `/${today}`);
}