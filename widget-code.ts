const buildCode = (
  size: string,
  address: string,
  name: string,
  green: boolean
) => `<script
src="https://unpkg.com/churrofi-widgets@0.0.9/dist/
     churrofi-widgets-${size}.js?module"
type="module"
></script>

<churrofi-widgets-${size}
address="${address}"
${name && `name="${name}"`} ${green ? `theme="green"` : ""}
></churrofi-widgets-${size}>`;

export default buildCode;
