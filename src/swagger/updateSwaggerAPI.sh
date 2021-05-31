# Description: Script to process openapi.yaml and generate a partial used by the view swagger.html
# Example usage: bash updateSwaggerAPI.sh openapi.yaml

YAML=$1
PARTIAL="../partials/rest/swagger_partial.html"

# Generate full HTML using python script (https://gist.github.com/oseiskar/dbd51a3727fc96dcf5ed189fca491fb3)
python "swagger-yaml-to-html.py" < "$YAML" > "apiDoc.html"

# Extract partial part
cat "apiDoc.html" | awk 'BEGIN {show="false"}; $0=="<!-- START EXTRACT -->"{show="true"; next}; $0=="<!-- END EXTRACT -->"{show="false"}; show=="false"{next}; show=="true" {print; next}' > $PARTIAL