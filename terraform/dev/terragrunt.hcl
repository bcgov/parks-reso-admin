terraform {
  source = "git::https://github.com/bcgov/parks_reso-admin-terraform.git//?ref=main"
}

include {
  path = find_in_parent_folders()
}

locals {
  app_version = get_env("app_version", "")
  s3_bucket = get_env("s3_bucket", "")
}

generate "dev_tfvars" {
  path              = "dev.auto.tfvars"
  if_exists         = "overwrite"
  disable_signature = true
  contents          = <<-EOF
app_version = ${locals.app_version}
s3_bucket = ${locals.s3_bucket}
EOF
}
