const buildCode = (
  size: string,
  address: string,
  name: string,
  green: boolean
) => `
<!–– Paste this script in the head tag of your website -->
<script
  src="https://unpkg.com/churrofi-widgets@0.1.1/dist/
     churrofi-widgets-${size}.js?module"
  type="module"
></script>

<!-- Paste this in the body section of your website -->
<churrofi-widgets-${size}
  address="${address}"
  ${name && `name="${name}"`} ${green ? `theme="green"` : ""}
></churrofi-widgets-${size}>`;

export default buildCode;
