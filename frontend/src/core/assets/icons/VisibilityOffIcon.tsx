export interface Props {
  onClick?: () => void;
}

export default function VisibilityOffIcon({ onClick }: Props) {
  return (
    <svg
      width="20"
      height="21"
      viewBox="0 0 20 21"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      onClick={onClick}
    >
      <path
        d="M16.1992 12.9541C16.9697 12.1892 17.5646 11.4291 17.9533 10.884C18.2067 10.5288 18.3333 10.3511 18.3333 10.0882C18.3333 9.8253 18.2067 9.64763 17.9533 9.29238C16.8149 7.69608 13.9077 4.25488 10 4.25488C9.2435 4.25488 8.5245 4.38385 7.84856 4.60344M5.62285 5.71107C3.94265 6.84422 2.70179 8.37377 2.0467 9.29238C1.79334 9.64763 1.66667 9.8253 1.66667 10.0882C1.66667 10.3511 1.79334 10.5288 2.0467 10.884C3.18508 12.4804 6.09232 15.9216 10 15.9216C11.659 15.9216 13.1376 15.3013 14.3772 14.4654"
        stroke="black"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.21488 8.42163C7.77319 8.8633 7.5 9.47355 7.5 10.1475C7.5 11.4955 8.59275 12.5883 9.94075 12.5883C10.6147 12.5883 11.225 12.3151 11.6667 11.8734"
        stroke="black"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M2.5 2.58826L17.5 17.5883"
        stroke="black"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
