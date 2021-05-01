# Ticketing

## Setup

### Kubernetes Implicit Commands
```
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v0.45.0/deploy/static/provider/cloud/deploy.yaml
kubectl create secret generic jwt-secret --from-literal=JWT_KEY=<insert_private_key>
```
