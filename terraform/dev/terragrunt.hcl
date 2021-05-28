terraform {
  source = "git::https://github.com/bcgov/parks_reso-admin-terraform.git//?ref=v0.0.0"
}

include {
  path = find_in_parent_folders()
}

generate "dev_tfvars" {
  path              = "dev.auto.tfvars"
  if_exists         = "overwrite"
  disable_signature = true
  contents          = <<-EOF
service_names = ["parks-reso-admin"]
EOF
}
