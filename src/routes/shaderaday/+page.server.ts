import { redirect } from "@sveltejs/kit";

export function load({url}){
  const today = new Date().toISOString().split('T')[0];
  const destination = `${url.pathname}/${today}`
  throw redirect(307, destination);
}