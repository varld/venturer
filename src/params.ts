export let paramUrl = <T extends Record<string, string | number>>(url: string) => (
  params: T
) => {
  let newUrl = url;

  for (let key in params) {
    newUrl = newUrl.replace(`{${key}}`, params[key].toString());
  }

  return newUrl;
};
