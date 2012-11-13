class {'postgresql::server': 
  listen => ['*',],
  acl => ['host all all 0.0.0.0/0 md5', ],
}

postgresql::db { 'jungles_test':
  password => '1234',
  require => Service['postgresql-system-9.1'],
}

pg_user {'vagrant':
  ensure   => present,
  password => '1234',
  require => Service['postgresql-system-9.1'],
}
