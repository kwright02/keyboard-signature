{{/* Generate chart name and labels */}}
{{- define "keyboard-signature.fullname" -}}
{{- printf "%s" .Release.Name | trunc 63 | trimSuffix "-" -}}
{{- end -}}

{{- define "keyboard-signature.labels" -}}
app.kubernetes.io/name: {{ include "keyboard-signature.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
app.kubernetes.io/version: {{ .Chart.AppVersion }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end -}}

{{- define "keyboard-signature.selectorLabels" -}}
app.kubernetes.io/name: {{ include "keyboard-signature.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end -}}

{{- define "keyboard-signature.name" -}}
{{- .Chart.Name -}}
{{- end -}}
