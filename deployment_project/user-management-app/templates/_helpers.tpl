{{/*
Expand the name of the chart.
*/}}
{{- define "user-management-app.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create a default fully qualified app name.
*/}}
{{- define "user-management-app.fullname" -}}
{{- if .Values.fullnameOverride }}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- $name := default .Chart.Name .Values.nameOverride }}
{{- if contains $name .Release.Name }}
{{- .Release.Name | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}
{{- end }}

{{/*
Create chart name and version as used by the chart label.
*/}}
{{- define "user-management-app.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Backend Common labels
*/}}
{{- define "user-management-app.backend.labels" -}}
helm.sh/chart: {{ include "user-management-app.chart" . }}
{{ include "user-management-app.backend.selectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
app.kubernetes.io/component: backend
{{- end }}

{{/*
Backend Selector labels
*/}}
{{- define "user-management-app.backend.selectorLabels" -}}
app.kubernetes.io/name: {{ include "user-management-app.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
app.kubernetes.io/component: backend
{{- end }}

{{/*
Frontend Common labels
*/}}
{{- define "user-management-app.frontend.labels" -}}
helm.sh/chart: {{ include "user-management-app.chart" . }}
{{ include "user-management-app.frontend.selectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
app.kubernetes.io/component: frontend
{{- end }}

{{/*
Frontend Selector labels
*/}}
{{- define "user-management-app.frontend.selectorLabels" -}}
app.kubernetes.io/name: {{ include "user-management-app.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
app.kubernetes.io/component: frontend
{{- end }}

{{/*
Backend fully qualified name
*/}}
{{- define "user-management-app.backend.fullname" -}}
{{- printf "%s-backend" (include "user-management-app.fullname" .) }}
{{- end }}

{{/*
Frontend fully qualified name
*/}}
{{- define "user-management-app.frontend.fullname" -}}
{{- printf "%s-frontend" (include "user-management-app.fullname" .) }}
{{- end }}

{{/*
Create the name of the backend service account to use
*/}}
{{- define "user-management-app.backend.serviceAccountName" -}}
{{- if .Values.backend.serviceAccount.create }}
{{- default (include "user-management-app.backend.fullname" .) .Values.backend.serviceAccount.name }}
{{- else }}
{{- default "default" .Values.backend.serviceAccount.name }}
{{- end }}
{{- end }}

{{/*
Create the name of the frontend service account to use
*/}}
{{- define "user-management-app.frontend.serviceAccountName" -}}
{{- if .Values.frontend.serviceAccount.create }}
{{- default (include "user-management-app.frontend.fullname" .) .Values.frontend.serviceAccount.name }}
{{- else }}
{{- default "default" .Values.frontend.serviceAccount.name }}
{{- end }}
{{- end }}