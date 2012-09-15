<?php
class nxcExtendedAttributeFilter {

	public function __construct() {
	}

	public function getFilters( $params ) {
		$return = array(
			'tables'   => null,
			'joins'    => null,
			'columns'  => null,
			'group_by' => null
		);

		if( isset( $params['sub_filters'] ) && is_array( $params['sub_filters'] ) ) {
			$subFilters = $params['sub_filters'];
			foreach( $subFilters as $subFilterInfo ) {
				if(
					isset( $subFilterInfo['callback'] ) === false ||
					is_array( $subFilterInfo['callback'] ) === false ||
					isset( $subFilterInfo['callback']['method_name'] ) === false ||
					is_scalar( $subFilterInfo['callback']['method_name'] ) === false
				) {
					continue;
				}

				$callback   = array();
				$callback[] = isset( $subFilterInfo['callback']['class_name'] ) ? $subFilterInfo['callback']['class_name'] : 'nxcExtendedAttributeFilter';
				$callback[] = $subFilterInfo['callback']['method_name'];

				$params = isset( $subFilterInfo['params'] ) ? $subFilterInfo['params'] : array();
				if( is_array( $params ) === false ) {
					$params = array( $params );
				}

				if( is_callable( $callback ) ) {
					$subFilterResult = call_user_func( $callback, $params );
					foreach( $return as $key => $value ) {
						if( isset( $subFilterResult[ $key ] ) && is_scalar( $subFilterResult[ $key ] ) ) {
							$return[ $key ] = $value . $subFilterResult[ $key ];
						}
					}
				}
			}
		}

		if( is_null( $return['group_by'] ) ) {
			unset( $return['group_by'] );
		}
		return $return;
	}

	public static function userAccount( $params ) {
		$db = eZDB::instance();

		$joins = 'ezuser.contentobject_id = ezcontentobject.id AND ezuser_setting.user_id = ezcontentobject.id AND ';
		if( isset( $params['login'] ) ) {
			$joins .= 'ezuser.login="' . $db->escapeString( $params['login'] ) . '" AND ';
		}
		if( isset( $params['email'] ) ) {
			$joins .= 'ezuser.email="' . $db->escapeString( $params['email'] ) . '" AND ';
		}
		if( isset( $params['enabled'] ) ) {
			$joins .= 'ezuser_setting.is_enabled=' . (int) $params['enabled'] . ' AND ';
		}
		$return = array(
			'tables'  => ', ezuser, ezuser_setting',
			'joins'   => $joins
		);
		return $return;
	}
}
?>