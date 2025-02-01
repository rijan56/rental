export const getCookie = (name: string) => {
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  if (match) {
    console.log(match);
    return match[2];
  }
  return null;
};
