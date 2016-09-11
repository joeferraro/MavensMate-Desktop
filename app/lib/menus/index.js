export default function template(platform) {
  import template from './'+platform;
  return template(platform);
}