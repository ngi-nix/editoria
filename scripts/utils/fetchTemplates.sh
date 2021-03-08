#!/bin/bash
set -e
# List of all the templates
[ -e draft ] || git clone https://gitlab.pagedmedia.org/pagedjs-templates/atla.git ./templates/atla
